import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { createLogger } from '../utils/logger';
import TodoItem from '../models/TodoItem';
import TodoUpdate from '../models/TodoUpdate';

const XAWS = AWSXRay.captureAWS(AWS);
const logger = createLogger('TodosAccess');

const docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient();
const todosTable = process.env.TODOS_TABLE;
const todosCreatedAtIndex = process.env.TODOS_CREATED_AT_INDEX;
const attachmentS3Bucket = process.env.ATTACHMENT_S3_BUCKET;

export const createTodoItem = async (item: object | any): Promise<TodoItem> => {
    logger.info('Creating todo');
    const params = {
        TableName: todosTable,
        Item: item,
    };

    await docClient.put(params).promise();

    return item;
};

export const updateTodoItem = async (
    userId: string,
    todoId: string,
    updatedTodo: TodoUpdate
): Promise<TodoItem> => {
    logger.info(`Updating todo ${todoId}`);

    const params = {
        TableName: todosTable,
        Key: {
            userId,
            todoId,
        },
        UpdateExpression:
            'set #name = :name, #dueDate = :dueDate, #done = :done',
        ExpressionAttributeNames: {
            '#name': 'name',
            '#dueDate': 'dueDate',
            '#done': 'done',
        },
        ExpressionAttributeValues: {
            ':name': updatedTodo.name,
            ':dueDate': updatedTodo.dueDate,
            ':done': updatedTodo.done,
        },
        ReturnValues: 'ALL_NEW',
    };

    const result = await docClient.update(params).promise();
    const item = result.Attributes;

    return item as TodoItem;
};

export const deleteTodoItem = async (userId: string, todoId: string) => {
    logger.info(`Deleting todo: ${todoId}`);

    const params = {
        TableName: todosTable,
        Key: {
            userId,
            todoId,
        },
    };

    await docClient.delete(params).promise();
    logger.info('Todo is deleted!');
};

export const getTodosByUserId = async (userId: string): Promise<TodoItem[]> => {
    logger.info('Getting todos');

    const params = {
        IndexName: todosCreatedAtIndex,
        ExpressionAttributeValues: {
            ':userId': userId,
        },
        KeyConditionExpression: 'userId = :userId',
        TableName: todosTable,
    };

    const result = await docClient.query(params).promise();

    return result.Items as TodoItem[];
};

export const updateTodoAttachmentUrl = async (
    todoId: string,
    userId: string
): Promise<TodoItem> => {
    logger.info(`Updating todo attachment url: ${todoId}`);

    const attachmentUrl: string = `https://${attachmentS3Bucket}.s3.amazonaws.com/${todoId}`;

    const params = {
        TableName: todosTable,
        Key: {
            userId: userId,
            todoId: todoId,
        },
        UpdateExpression: 'set #attachmentUrl = :attachmentUrl',
        ExpressionAttributeNames: {
            '#attachmentUrl': 'attachmentUrl',
        },
        ExpressionAttributeValues: {
            ':attachmentUrl': attachmentUrl,
        },
        ReturnValues: 'ALL_NEW',
    };

    const result = await docClient.update(params).promise();
    const item = result.Attributes;

    return item as TodoItem;
};
