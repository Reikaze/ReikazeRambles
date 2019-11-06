import React, { useContext, useState, useEffect } from "react";
import { graphql } from "gatsby";
import GitHubIcon from "../assets/icons/github.svg";
import CommentsIcon from "../assets/icons/message.svg";
import { DiscussionEmbed } from "disqus-react";

import { Layout } from "../components/layout";
import { SEO } from "../components/seo";
import { PostMetadata, PostTitleHeader } from "../components/post-view";
import { OutboundLink } from "gatsby-plugin-google-analytics";
import { ThemeContext } from "../components/theme-context";

const BlogPostTemplateChild = props => {
	const post = props.data.markdownRemark;
	const siteData = props.data.site.siteMetadata;
	const slug = post.fields.slug;

	const { currentTheme } = useContext(ThemeContext);

	const [disqusConfig, setDisqusConfig] = useState(currentTheme);

	/**
	 * Toggle the Disqus theme
	 * Disqus will by default try to guess what theme to pick based on the
	 * color of the background. As a result, we don't have to do much other than
	 * reload it after the page theme change is finished
	 */
	useEffect(() => {
		setTimeout(() => {
			if (!setDisqusConfig || !currentTheme) return;
			setDisqusConfig({
				url: `${siteData.siteUrl}posts${slug}`,
				// TODO: Fix this, this is causing comments to not apply to the correct
				//   post. This identifier should NEVER change and should ALWAYS match
				//   `slug` only
				identifier: `${slug}${currentTheme}`,
				title: post.frontmatter.title
			});
			// Must use a `useTimeout` so that this reloads AFTER the background animation
		}, 600);
	}, [currentTheme, post.frontmatter.title, siteData.siteUrl, slug]);

	const GHLink = `https://github.com/${siteData.repoPath}/tree/master${siteData.relativeToPosts}${slug}index.md`;

	return (
		<>
			<SEO
				title={post.frontmatter.title}
				description={post.frontmatter.description || post.excerpt}
				unicornData={post.frontmatter.authors} //might need to do CSV list here
				publishedTime={post.frontmatter.published}
				editedTime={post.frontmatter.edited}
				keywords={post.frontmatter.tags}
				type="article"
			/>
			<article>
				<header role="banner" className="marginZeroAutoChild">
					<PostTitleHeader post={post} />
					<PostMetadata post={post} />
				</header>
				<main
					className="post-body"
					data-testid={"post-body-div"}
					dangerouslySetInnerHTML={{ __html: post.html }}
				/>
				<footer role="contentinfo" className="post-lower-area">
					<div className="postBottom">
						<div className="btnLike prependIcon">
							<CommentsIcon />
							<p>Comments</p>
						</div>
					</div>
					<DiscussionEmbed
						shortname={siteData.disqusShortname}
						config={disqusConfig}
						key={currentTheme}
					/>
				</footer>
			</article>
		</>
	);
};

const BlogPostTemplate = props => {
	const siteTitle = props.data.site.siteMetadata.title;

	return (
		<Layout location={props.location} title={siteTitle}>
			<BlogPostTemplateChild {...props} />
		</Layout>
	);
};

export default BlogPostTemplate;

export const pageQuery = graphql`
	query BlogPostBySlug($slug: String!) {
		site {
			siteMetadata {
				title
				siteUrl
				disqusShortname
				repoPath
				relativeToPosts
			}
		}
		markdownRemark(fields: { slug: { eq: $slug } }) {
			...PostInfo
		}
	}
`;
