import type {
	MarbleAuthorList,
	MarbleCategoryList,
	MarblePost,
	MarblePostList,
	MarbleTagList,
} from "@/types/blog";
import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSanitize from "rehype-sanitize";

const url =
	process.env.NEXT_PUBLIC_MARBLE_API_URL ?? "https://api.marblecms.com";
const key = process.env.MARBLE_WORKSPACE_KEY ?? "cmd4iw9mm0006l804kwqv0k46";

const emptyPagination = {
	limit: 0,
	currpage: 0,
	nextPage: null,
	prevPage: null,
	totalItems: 0,
	totalPages: 0,
};

async function fetchFromMarble<T>({
	endpoint,
	fallback,
}: {
	endpoint: string;
	fallback: T;
}): Promise<T> {
	try {
		const response = await fetch(`${url}/${key}/${endpoint}`);
		if (!response.ok) {
			throw new Error(
				`Failed to fetch ${endpoint}: ${response.status} ${response.statusText}`,
			);
		}
		return (await response.json()) as T;
	} catch (error) {
		console.warn(`Marble fetch failed for ${endpoint}. Using fallback data.`, error);
		return fallback;
	}
}

export async function getPosts() {
	return fetchFromMarble<MarblePostList>({
		endpoint: "posts",
		fallback: { posts: [], pagination: emptyPagination },
	});
}

export async function getTags() {
	return fetchFromMarble<MarbleTagList>({
		endpoint: "tags",
		fallback: { tags: [], pagination: emptyPagination },
	});
}

export async function getSinglePost({ slug }: { slug: string }) {
	return fetchFromMarble<MarblePost | null>({
		endpoint: `posts/${slug}`,
		fallback: null,
	});
}

export async function getCategories() {
	return fetchFromMarble<MarbleCategoryList>({
		endpoint: "categories",
		fallback: { categories: [], pagination: emptyPagination },
	});
}

export async function getAuthors() {
	return fetchFromMarble<MarbleAuthorList>({
		endpoint: "authors",
		fallback: { authors: [], pagination: emptyPagination },
	});
}

export async function processHtmlContent({
	html,
}: {
	html: string;
}): Promise<string> {
	const processor = unified()
		.use(rehypeSanitize)
		.use(rehypeParse, { fragment: true })
		.use(rehypeSlug)
		.use(rehypeAutolinkHeadings, { behavior: "append" })
		.use(rehypeStringify);

	const file = await processor.process({ value: html, type: "html" });
	return String(file);
}
