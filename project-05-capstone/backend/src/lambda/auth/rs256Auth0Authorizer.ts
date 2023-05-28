import 'source-map-support/register';
import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda';
import { verify } from 'jsonwebtoken';
import JwtPayload from '../../auth/JwtPayload';

const cert = `-----BEGIN CERTIFICATE-----
MIIDHTCCAgWgAwIBAgIJDRI29Jl/lv+2MA0GCSqGSIb3DQEBCwUAMCwxKjAoBgNV
BAMTIWRldi1rZnRscHo2Zmc2dmtsYnlnLnVzLmF1dGgwLmNvbTAeFw0yMzA1MjIw
MzM5MzNaFw0zNzAxMjgwMzM5MzNaMCwxKjAoBgNVBAMTIWRldi1rZnRscHo2Zmc2
dmtsYnlnLnVzLmF1dGgwLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoC
ggEBAPRjRwNU3QtXnqIPUzJYXLHNceHOnJ61lWURAPTkmv+4Sll24hXKbufSS1sy
DMcgGTnA3tWP4RzZCTjMcoeNvM8W2jR+QBy3+XlSfMXijs9UfoIg1yIbDeNyVs9t
s69pynVLGFm2GPP8jF9qUD1ZYXdHcDfMdB7pWfYQaz6EhxyBKiyAqY2MirFnoUCE
MWvIyleBg3kJnoErWRWotbqkLB8Er9iaMFej0PGDGUDMIkn7r9xhbELUOXV7p4So
xDjr/fClnDeDhwzyE876+8eaHKRtks3gqfE4r3eQQdu72kK9WZFlLxhpXqvNBD1w
7kWfT1cjryl6GsWWRYAL60IL5CcCAwEAAaNCMEAwDwYDVR0TAQH/BAUwAwEB/zAd
BgNVHQ4EFgQU0jLf0Fvwp13BkYhk7442Me85stQwDgYDVR0PAQH/BAQDAgKEMA0G
CSqGSIb3DQEBCwUAA4IBAQDWMy2w9TXzsQElNFfzovyiVwcqnowtl0n1lHuaF7Ge
lHAT3SZpFHY/MVzSLdqltbkfChRwjdnS3IZCsB4neCrqXGzRLqvydLdUbAVAmNSC
VkNX40ZUCcr0PWlKeiZtBDOiQhhhdu1UDK8xcntqOTRSaM+FoWb0wOh1k0MDVIfO
keV70lO3TPILLfjTkBJOOuBxWa0REkPHwSwo1opSO3GYAhoh79tEwxCrnUTI08Dx
r/qGewL2CZlqANnRnQAT1NV3djoUQm8Z3LpNWuXt/TRe8w09ZArVLcPde2EtGhT2
RL8dDjoK+3q0PfXfw+4qgQAt+TyXc1jB6TV1xxbJLSXB
-----END CERTIFICATE-----`;

export const handler = async (
    event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
    try {
        const jwtToken = verifyToken(event.authorizationToken);
        console.log('Authorized!!!', jwtToken);

        return {
            principalId: jwtToken.sub,
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Allow',
                        Resource: '*',
                    },
                ],
            },
        };
    } catch (e) {
        console.log('Not authorized: ', e.message);

        return {
            principalId: 'user',
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Deny',
                        Resource: '*',
                    },
                ],
            },
        };
    }
};

const verifyToken = (authHeader: string): JwtPayload => {
    if (!authHeader) throw new Error('No authentication header');

    if (!authHeader.toLowerCase().startsWith('bearer '))
        throw new Error('Invalid authentication header');

    const split = authHeader.split(' ');
    const token = split[1];

    return verify(token, cert, { algorithms: ['RS256'] }) as JwtPayload;
};
