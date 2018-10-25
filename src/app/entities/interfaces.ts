export interface Post {
    postId: number;
    title: string;
    description: string;
    path: string;
    userId: number;
    user: string;
    upvotes: number;
    downvotes: number;
    yourvote: number;
    big: boolean;
    comment: Comment[];
}

export interface Session {
    sessionkey: string;
    userId: number;
    user: User;
}

export interface Comment {
    commentId: number;
    user: string;
    text: string;
    upvotes: number;
    downvotes: number;
    yourvote: number;
    comment: Comment[];
    reply: boolean;
    collapse: boolean;
}

export interface User {
    userId: number;
    username: string;
}

export interface Response {
    success: boolean;
    message: string;
    code: number;
    data: any;
}

export enum PageShown {
    new, hot, upload
}