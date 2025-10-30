import React from "react";
import Body from "../../components/Body/Body";
import Button from "../../components/Button/Button";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import Input from "../../components/Input/Input";
import TaskCard from "../../components/TaskCard/TaskCard";
import Textarea from "../../components/Textarea/Textarea";
import "./Dashboard.css";


function Dashboard() {

    return(
        <>
        <div id="dashboard-page" className="animate__animated animate__fadeInDown ">
            <Header>
                <h1>Hello..., Start planning today!</h1> <br />
            </Header>

            <Body>
                <div class="parent">
                    <div class="div1">1</div>
                    <div class="div2">2</div>
                    <div className="container-add-filter-task">
                        <div className="form-enter-task">
                            <Input 
                                type="text"
                                placeholder="Type Title Of Task"
                                className="task-title-input"
                            />

                            <Textarea
                                placeholder="Detail Of Your Task"
                                className="task-detail-input"
                            />
                                
                            <Button className="add-task-btn">
                                <i class="fa-solid fa-plus"></i>
                            </Button>
                        </div>

                        <div className="form-filter-task">
                            <select className="filter-task" defaultValue="">
                                <option value="" disabled>By category</option>
                                <option value="work">Work</option>
                                <option value="personal">Personal</option>
                                <option value="study">Study</option>
                            </select>

                            <select className="filter-select" defaultValue="">
                                <option value="" disabled>By priority</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>

                            <div className="search-task-by-name">
                                <Input 
                                    type="text"
                                    placeholder="Search by name"
                                    className="search-input"
                                />
                                <i className="fa-solid fa-magnifying-glass search-icon"></i>
                            </div>
                        </div>
                    </div>

                    <div class="div6">6</div>

                    <div className="container-task">
                        <div className="subcontainer-task">
                            {/* Task one */}
                            <TaskCard className="content-task-one">
                                    <div className="content-left">
                                        <h2>Learn Javascript</h2>
                                        <p>Master the language powering the modern web.</p>
                                        <h3>Start date: {new Date().getDate()}</h3>
                                    </div>

                                     <div className="content-right">
                                        <Button className="btn-task btn-check-circle">
                                            <i class="fa-solid fa-check-circle"></i>
                                        </Button>

                                        <Button className="btn-task btn-pen-to-square">
                                            <i class="fa-solid fa-pen-to-square"></i>
                                        </Button>

                                        <Button className="btn-task btn-trash">
                                            <i class="fa-solid fa-trash"></i>
                                        </Button>
                                    </div>
                            </TaskCard>

                            {/* Task two */}
                            <TaskCard className="content-task-two">
                                    <div className="content-left">
                                        <h2>Learn Javascript</h2>
                                        <p>Master the language powering the modern web.</p>
                                        <h3>Start date: {new Date().getDate()}</h3>
                                    </div>

                                     <div className="content-right">
                                        <Button className="btn-task btn-check-circle">
                                            <i class="fa-solid fa-check-circle"></i>
                                        </Button>

                                        <Button className="btn-task btn-pen-to-square">
                                            <i class="fa-solid fa-pen-to-square"></i>
                                        </Button>

                                        <Button className="btn-task btn-trash">
                                            <i class="fa-solid fa-trash"></i>
                                        </Button>
                                    </div>
                            </TaskCard>

                            {/* Task three */}
                            <TaskCard className="content-task-three">
                                    <div className="content-left">
                                        <h2>Learn Javascript</h2>
                                        <p>Master the language powering the modern web.</p>
                                        <h3>Start date: {new Date().getDate()}</h3>
                                    </div>

                                     <div className="content-right">
                                        <Button className="btn-task btn-check-circle">
                                            <i class="fa-solid fa-check-circle"></i>
                                        </Button>

                                        <Button className="btn-task btn-pen-to-square">
                                            <i class="fa-solid fa-pen-to-square"></i>
                                        </Button>

                                        <Button className="btn-task btn-trash">
                                            <i class="fa-solid fa-trash"></i>
                                        </Button>
                                    </div>
                            </TaskCard>

                            {/* Task four */}
                            <TaskCard className="content-task-four">
                                    <div className="content-left">
                                        <h2>Learn Javascript</h2>
                                        <p>Master the language powering the modern web.</p>
                                        <h3>Start date: {new Date().getDate()}</h3>
                                    </div>

                                     <div className="content-right">
                                        <Button className="btn-task btn-check-circle">
                                            <i class="fa-solid fa-check-circle"></i>
                                        </Button>

                                        <Button className="btn-task btn-pen-to-square">
                                            <i class="fa-solid fa-pen-to-square"></i>
                                        </Button>

                                        <Button className="btn-task btn-trash">
                                            <i class="fa-solid fa-trash"></i>
                                        </Button>
                                    </div>
                            </TaskCard>
                        </div>
                    </div>

                    <div class="div8">8</div>
                    <div class="div9">9</div>
                    <div class="div10">10</div>
                </div>
            </Body>

            <Footer className="footer-pages">
                <p>&copy; {new Date().getFullYear()} My todo - list web</p>
                <div className="social-icons">
                    <Button className="social-btn btn-Facebook">
                        <a href="https://www.facebook.com/share/1AD9oX3wBW/" className="facebook"><i className="fab fa-facebook-f"></i></a>
                    </Button>
                
                    <Button className="social-btn btn-Ig">
                        <a href="https://www.instagram.com/zan_nguyn07/?hl=en" className="instagram"><i class="fa-brands fa-instagram"></i></a>
                    </Button>
                
                    <Button className="social-btn btn-Github">
                        <a href="https://github.com/VanNguyn07" className="github"><i className="fa-brands fa-github"></i></a>
                    </Button>

                    <Button className="social-btn btn-Linkedin">
                        <a href="#" className="linkedin"><i className="fab fa-linkedin-in"></i></a>
                    </Button>
                </div>
            </Footer>
        </div>
        </>
    );
}

export default Dashboard;