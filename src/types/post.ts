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
    seo: {
      title?: string;
      og_title?: string;
      og_image?: string;
      og_description?: string;
      description?: string;
      twitter_image?: string;
      twitter_title?: string;
      twitter_description?: string;
    };
  };
  tag_list?: string[];
}
