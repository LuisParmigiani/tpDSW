import React from "react";
import styles from "./AboutContainer.module.css";

function AboutContainer() {
    return(
        <div className={styles.aboutContainer}>
            <div className={styles.aboutContent}>
                <div className={styles.aboutText}>
                    <h1 className = {styles.aboutTextTitle}>Sobre nosotros</h1>
                    <p className={styles.aboutTextDescription}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime expedita aliquid excepturi natus doloribus eligendi odio voluptas blanditiis, recusandae, fugit sint exercitationem iusto similique perspiciatis beatae eius magnam voluptates amet aliquam. Libero, ducimus aperiam pariatur impedit incidunt consequatur esse accusantium numquam ex eius perferendis ad debitis aliquid odit! Laborum, saepe?</p>
                </div>
                <div className={styles.aboutImage}>
                    <img className={styles.aboutImageContent} src="/images/nosotros-about.jpg" alt="Foto de nosotros"/>
                </div>
            </div>
        </div>
    )
}

export default AboutContainer;