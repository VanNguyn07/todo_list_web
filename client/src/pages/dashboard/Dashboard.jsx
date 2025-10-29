import React from "react";
import Button from "../../components/Button";
import Header from "../../components/Header"
import Footer from "../../components/Footer";
import './Dashboard.css';


function Dashboard() {

    return(
        <>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"></link>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"></link>

        <div id="dashboard-page" className="animate__animated animate__fadeInDown ">
            <Header>
                <h1>Hello..., Start planning today!</h1> <br />
            </Header>

            <main>
                
            </main>

            <Footer>
                <p>&copy; {new Date().getFullYear()} My todo - list web</p>
                <div className="social-icons">
                    <Button className="btn-Facebook">
                        <a href="https://www.facebook.com/share/1AD9oX3wBW/" className="facebook"><i className="fab fa-facebook-f"></i></a>
                    </Button>
                
                    <Button className="btn-Ig">
                        <a href="https://www.instagram.com/zan_nguyn07/?hl=en" className="instagram"><i class="fa-brands fa-instagram"></i></a>
                    </Button>
                
                    <Button className="btn-Github">
                        <a href="https://github.com/VanNguyn07" className="github"><i className="fa-brands fa-github"></i></a>
                    </Button>

                    <Button className="btn-Linkedin">
                        <a href="#" className="linkedin"><i className="fab fa-linkedin-in"></i></a>
                    </Button>
                </div>
            </Footer>
        </div>
        </>
    );
}

export default Dashboard;