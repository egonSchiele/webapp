// Auto-generated API client

import type { ApiMoodsResponseGet, ApiMoodsResponsePost, ApiMoodResponseGet, ApiMoodsResponsePut } from "../../../src/common/apiTypes.js"

export async function apiMoodsGet(options:Record<string, any> = {}): Promise<ApiMoodsResponseGet> {
    try {
        const response = await fetch(`/api/moods`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            ...options,
        });
        if (!response.ok) {
            console.log(`Error calling API apiMoodsGet`);
        }
        return response.json();
    } catch (error) {
        console.error(`Error in apiMoodsGet:`, error);
        return { success: false, error } as ApiMoodsResponseGet;
    }
}

export async function apiMoodsPost(options:Record<string, any> = {}): Promise<ApiMoodsResponsePost> {
    try {
        const response = await fetch(`/api/moods`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            ...options,
        });
        if (!response.ok) {
            console.log(`Error calling API apiMoodsPost`);
        }
        return response.json();
    } catch (error) {
        console.error(`Error in apiMoodsPost:`, error);
        return { success: false, error } as ApiMoodsResponsePost;
    }
}

export async function apiMoodsIdDelete(id: string | number, options:Record<string, any> = {}): Promise<any> {
    try {
        const response = await fetch(`/api/moods/${id}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            ...options,
        });
        if (!response.ok) {
            console.log(`Error calling API apiMoodsIdDelete`);
        }
        return response.json();
    } catch (error) {
        console.error(`Error in apiMoodsIdDelete:`, error);
        return { success: false, error } as any;
    }
}

export async function apiMoodsIdGet(id: string | number, options:Record<string, any> = {}): Promise<ApiMoodResponseGet> {
    try {
        const response = await fetch(`/api/moods/${id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            ...options,
        });
        if (!response.ok) {
            console.log(`Error calling API apiMoodsIdGet`);
        }
        return response.json();
    } catch (error) {
        console.error(`Error in apiMoodsIdGet:`, error);
        return { success: false, error } as ApiMoodResponseGet;
    }
}

export async function apiMoodsIdPut(id: string | number, options:Record<string, any> = {}): Promise<ApiMoodsResponsePut> {
    try {
        const response = await fetch(`/api/moods/${id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            ...options,
        });
        if (!response.ok) {
            console.log(`Error calling API apiMoodsIdPut`);
        }
        return response.json();
    } catch (error) {
        console.error(`Error in apiMoodsIdPut:`, error);
        return { success: false, error } as ApiMoodsResponsePut;
    }
}

