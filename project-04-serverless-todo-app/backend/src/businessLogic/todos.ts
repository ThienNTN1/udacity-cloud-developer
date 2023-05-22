import { v4 as uuidV4 } from 'uuid';
import {
    getTodosByUserId,
    createTodoItem,
    deleteTodoItem,
    updateTodoItem,
    updateTodoAttachmentUrl, 
} from '../dataLayer/todosAcess';
import { getUploadedAttachmentUrl } from '../helpers/attachmentUtils';
import TodoItem from '../models/TodoItem';
import { CreateTodoRequest } from '../requests/CreateTodoRequest';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest';
import { createLogger } from '../utils/logger';

const logger = createLogger('Todos');

export const createTodo = async (
    userId: string,
    todo: CreateTodoRequest
): Promise<TodoItem> => {
    logger.info(`Creating Todo with userId: ${userId}`);

    return await createTodoItem({
        userId,
        todoId: uuidV4(),
        createdAt: new Date().toISOString(),
        done: false,
        ...todo,
    });
};

export const getTodosForUser = async (userId: string): Promise<TodoItem[]> => {
    return await getTodosByUserId(userId);
};

export const updateTodo = async (
    userId: string,
    todoId: string,
    updatedTodo: UpdateTodoRequest
): Promise<TodoItem> => {
    logger.info(`Updating Todo with userId: ${userId}`);
    return await updateTodoItem(userId, todoId, updatedTodo);
};

export const deleteTodo = async (
    userId: string,
    todoId: string
): Promise<void> => {
    logger.info(`Deleting Todo...`);

    await deleteTodoItem(userId, todoId);
};

export const createAttachmentPresignedUrl = async (
    todoId: string,
    userId: string
): Promise<string> => {
    logger.info(`Getting URL...`);

    await updateTodoAttachmentUrl(todoId, userId);
    return getUploadedAttachmentUrl(todoId);
};
