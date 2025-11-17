import React from "react";
import Logo from "../../assets/images/logo.png";

function TaskDashboard(){
    return(
        <div id="task-dashboard-page" className=" animate__animated animate__fadeIn ">
                        <Header>
                <nav className="sidebar-nav">
                    <div className="logo-header-page">
                        <img src={Logo} alt="Logo" />
                        <h1>Todo List</h1>
                    </div>
                        <Button className="btn-sidebar btn-home active">
                            <i class="fa-solid fa-house"></i>
                            <span>Home</span>
                        </Button>

                        <Button className="btn-sidebar btn-Tasks">
                            <i class="fa-solid fa-list-check"></i>
                            <span>Tasks</span>
                        </Button>

                        <Button className="btn-sidebar btn-pomodoro">
                            <i class="fa-solid fa-hourglass-half"></i>
                            <span>Pomodoro</span>
                        </Button>

                        <Button className="btn-sidebar btn-analytics">
                            <i class="fa-solid fa-chart-pie"></i>
                            <span>Analytics</span>
                        </Button>

                        <Button className="btn-sidebar btn-quick-notes">
                            <i class="fa-solid fa-note-sticky"></i>
                            <span>Quick Notes</span>
                        </Button>

                        <Button className="btn-sidebar btn-habit-tracker">
                            <i class="fa-solid fa-calendar-check"></i>
                            <span>Habit Tracker</span>
                        </Button>

                        <Button className="btn-sidebar btn-habit-tracker">
                            <i class="fa-solid fa-calendar-days"></i>
                            <span>Calendar</span>
                        </Button>

                        <Button className="btn-sidebar btn-habit-tracker">
                            <i class="fa-solid fa-gear"></i>
                            <span>Settings</span>
                        </Button>
                    </nav>
                <div className="header-page">
                    <div className="content-header">
                        <div className="container-navbar-header">
                            <div className="container-btn-header">

                            <div className="search-and-button-evt">
                                <div className="search-everything">
                                <Input 
                                    type="text"
                                    placeholder="Search everything..."
                                    className="input-search-evt"
                                />
                                <i className="fa-solid fa-magnifying-glass search-icon"></i>
                                </div>
                                
                                <div className="container-btn-search">
                                    
                                    <Button className="btn-search btn-seach-evt">
                                        <i className="fa-solid fa-magnifying-glass search-icon"></i>
                                    </Button>
                                </div>
                            </div>

                                <Button className="btn-modern btn-dark-light">
                                    <label class="switch">
                                    <input id="input" type="checkbox" checked="" />
                                    <div class="slider round">
                                        <div class="sun-moon">
                                        <svg id="moon-dot-1" class="moon-dot" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="50"></circle>
                                        </svg>
                                        <svg id="moon-dot-2" class="moon-dot" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="50"></circle>
                                        </svg>
                                        <svg id="moon-dot-3" class="moon-dot" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="50"></circle>
                                        </svg>
                                        <svg id="light-ray-1" class="light-ray" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="50"></circle>
                                        </svg>
                                        <svg id="light-ray-2" class="light-ray" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="50"></circle>
                                        </svg>
                                        <svg id="light-ray-3" class="light-ray" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="50"></circle>
                                        </svg>

                                        <svg id="cloud-1" class="cloud-dark" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="50"></circle>
                                        </svg>
                                        <svg id="cloud-2" class="cloud-dark" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="50"></circle>
                                        </svg>
                                        <svg id="cloud-3" class="cloud-dark" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="50"></circle>
                                        </svg>
                                        <svg id="cloud-4" class="cloud-light" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="50"></circle>
                                        </svg>
                                        <svg id="cloud-5" class="cloud-light" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="50"></circle>
                                        </svg>
                                        <svg id="cloud-6" class="cloud-light" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="50"></circle>
                                        </svg>
                                        </div>
                                        <div class="stars">
                                        <svg id="star-1" class="star" viewBox="0 0 20 20">
                                            <path
                                            d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"
                                            ></path>
                                        </svg>
                                        <svg id="star-2" class="star" viewBox="0 0 20 20">
                                            <path
                                            d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"
                                            ></path>
                                        </svg>
                                        <svg id="star-3" class="star" viewBox="0 0 20 20">
                                            <path
                                            d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"
                                            ></path>
                                        </svg>
                                        <svg id="star-4" class="star" viewBox="0 0 20 20">
                                            <path
                                            d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"
                                            ></path>
                                        </svg>
                                        </div>
                                    </div>
                                    </label>
                                </Button>

                            
                                    <Button className="btn-modern btn-contract">
                                        <i className="fa-solid fa-file-signature"></i>
                                        <span>Contact</span>
                                    </Button>

                                    <Button className="btn-modern btn-aboutme">
                                        <i className="fa-solid fa-circle-info"></i>
                                        <span>About us</span>
                                    </Button>

                                    <Button className="btn-modern btn-quick-add">
                                        <i class="fa-solid fa-plus"></i>
                                    </Button>
                                    
                                    <Button className="btn-modern btn-noti">
                                        <i className="fa-solid fa-bell"></i>
                                    </Button>

                                    <Button className="btn-modern btn-user">
                                        <i className="fa-solid fa-user"></i>
                                    </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </Header>
        </div>
    );
}

export default TaskDashboard