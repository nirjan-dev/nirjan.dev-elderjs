export interface SEOProps {
  title?: string;
  description?: string;
  pathname?: string;
  image?: string;

  ogTitle?: string;
  ogImage?: string;
  ogDescription?: string;
  ogType?: string;

  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;

  disableIndex?: boolean;
}
