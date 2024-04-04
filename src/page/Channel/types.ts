export interface PostData {
    writer: string;
    title: string;
    content: string;
    writeDate: Date;
    modifyDate: Date;
    repliesCount: number;
    writerData: {
        nickname: string;
        profileImageUrl: string;
    }
}

export interface PostListData {
    page: number;
    allPageCount: number;
    allPostsCount: number;
    posts: PostData[];
}