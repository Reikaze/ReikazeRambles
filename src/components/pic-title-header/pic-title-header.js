import React, { useMemo } from "react"
import Image from "gatsby-image"
import styles from "./pic-title-header.module.scss"
import GitHub from '../../assets/icons/github.svg'
import Twitter from '../../assets/icons/twitter.svg'
import { OutboundLink } from "gatsby-plugin-google-analytics"

const SocialBtn = ({icon, text, url, name}) => {
  const nameS = useMemo(() => {
    if (name.endsWith('s')) return `${name}'`;
    return `${name}'s`;
  }, [name])
  return <OutboundLink className='unlink baseBtn lowercase prependIcon' href={url}>
    <span className={styles.svgContainer} aria-hidden={true}>{icon()}</span>
    <span className='visually-hidden'>Link to {nameS}</span>
    <span>
      {text}
    </span>
    <span className='visually-hidden'>account</span>
  </OutboundLink>
}

/**
 *
 * @param image
 * @param socials - Match the object of the authorsJson socials
 * @param title
 * @param description
 * @param author - Is an author pic?
 * @constructor
 */
export const PicTitleHeader = ({ image, socials, title, description, author = false }) => {
  return (
    <div className={styles.container}>
      <Image className={styles.headerPic} style={author ? { borderRadius: "50%" } : {}} fixed={image}
             loading={"eager"}/>
      <div className={styles.noMgContainer}>
        <h1 className={styles.title}>{title}</h1>
        <h2 className={styles.subheader}>{description}</h2>
        {socials && <div className={styles.socialsContainer}>
          {socials.twitter && <SocialBtn icon={Twitter} text={'Twitter'} name={title} url={`https://twitter.com/${socials.twitter}`}/>}
          {socials.github && <SocialBtn icon={GitHub} text={'GitHub'} name={title} url={`https://github.com/${socials.github}`}/>}
        </div>}
      </div>
    </div>
  )
}