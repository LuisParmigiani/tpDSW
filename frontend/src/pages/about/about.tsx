import React from 'react'
import styles from './about.module.css'
import Navbar from '../../components/navBar/Navbar.js'


function About () {
    return(
    <>
        <div className={styles.container}>
            <div  className={styles.navBarContainer}>
                <Navbar/>
            </div>
            <div className={styles.aboutContainer}>
                
            </div>
        </div>
    </>
    )

}
export default About