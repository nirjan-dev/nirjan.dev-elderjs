export interface Post {
  slug: string;
  name: string;
  published_at: string;
  first_published_at: string;
  content: {
    excerpt: string;
    body: string;
    cover: {
      alt: string;
      filename: string;
    };
    draft: boolean;
  };
}
