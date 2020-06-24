declare module 'embed-video' {

    interface EmbedVideo {
        (url: string, opts?: any): string;
        vimeo: (id: string, opts?: any) => string;
        youtube: (id: string, opts?: any) => string;
        dailymotion: (id: string, opts?: any) => string;
    }

    const EmbedVideo: EmbedVideo;

    export = EmbedVideo;
}