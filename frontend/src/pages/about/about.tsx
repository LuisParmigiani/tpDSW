import React from 'react'
import styles from './about.module.css'
import Navbar from '../../components/navBar/Navbar.js'
import AboutContainer from '../../components/AboutContainer/index.js'


function About () {
    return(
    <>
        <div className={styles.container}>
            <div  className={styles.navBarContainer}>
                <Navbar/>
            </div>
            <AboutContainer/>
        </div>
    </>
    )

}
export default About