import React, { ReactNode, useMemo } from "react"
import Cookies from "js-cookie"
import { Head, router, usePage } from "@inertiajs/react"
import { requestService } from "~/services/api.service"
import { useStore } from "../../context/store"
import { navItems } from "~/app/menus"

interface MainLayoutProps {
    children: ReactNode
    title: string
}

const MainLayout: React.FC<MainLayoutProps> = ({children, title}) => {

    const { url } = usePage()

    const breadcrumb = useMemo(() => {
        const segments = url.toString().replaceAll('/', ' ').split(' ').filter(segment => segment !== '')
        let route = ''
        return {
            segments: segments.length > 0 ? segments.map((segment) => {
                route += `/${segment}`
                return ({
                    label: segment.charAt(0).toUpperCase() + segment.slice(1),
                    route: `${route}`
                })
            }) : [{ label: 'page', route: '/' }, { label: 'dashboard', route: '/dashboard' }]
        }
    },[url])

    console.log(breadcrumb.segments[0].route)

    const { user, hasAccess } = useStore()

    const token = Cookies.get('token')

    if (!token ||token === undefined) {
        router.visit('/dashboard/login')
        return null
    }

    const onLogout = () => requestService({url: '/dashboard/logout', method: 'get'}).then(() => {
        Cookies.remove('token')
        Cookies.remove('user')
        router.visit('/dashboard/login')
    })

    const isRoute = (route: string) => {
        const current = window.location.pathname
        return (route === current || route === current.split('/')[1])
    }

    if (window.performance) {
        const token = Cookies.get('token')
        if (token) {
            requestService({
                url: '/dashboard/admin/users/permissions',
                method: 'get',
            })
                .then(response => localStorage.setItem('abilities', response.data.permissions))
        }
    }

    return (
        <>
        <Head title={title} />
        <div className="g-sidenav-show bg-gray">
            <aside className="sidenav navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-3 bg-white" id="sidenav-main">
                <div className="sidenav-header">
                    <i className="fas fa-times p-3 cursor-pointer text-secondary opacity-5 position-absolute end-0 top-0 d-none d-xl-none" aria-hidden="true" id="iconSidenav"></i>
                    <a className="navbar-brand m-0" href=" https://demos.creative-tim.com/soft-ui-dashboard/pages/dashboard.html " target="_blank">
                        {/* <img src="" className="navbar-brand-img h-100" alt="main_logo"/> */}
                        <span className="ms-1 font-weight-bold">Soft UI Dashboard</span>
                    </a>
                </div>
                <hr className="horizontal dark mt-0"/>
                <div className="collapse navbar-collapse  w-auto " id="sidenav-collapse-main">
                    <ul className="navbar-nav">
                        {
                            navItems.map((items, _index) => (
                                hasAccess(items.permissions, items.sub_item) && (
                                    
                                    (items?.sub_item)
                                        ?   <li key={_index} className="nav-item" >
                                                <a className={`nav-link ${ isRoute(items.route) ? 'active' : ''}`} href={`#${items.route}`} data-bs-toggle="collapse" aria-expanded="false" aria-controls="admin">
                                                    <div className="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                                                        <i className={`fa-solid ${items.icon} ${!isRoute(items.route) ? 'text-dark' : ''} fa-xl`}></i>
                                                    </div>
                                                    <span className="nav-link-text ms-1">{ items.name }</span>
                                                </a>
                                                <div className={`collapse ${isRoute(items.route) ? 'show' : ''}`} id={items.route}>
                                                    <ul className="navbar-nav navbar-nav-collapse-padding">
                                                        {
                                                            items.sub_item.map((item, index) => (
                                                                hasAccess(item.permissions) &&
                                                                    <li key={index} className="nav-item navbar-nav-collapse-border-style" style={{ borderBottom: isRoute(item.route) ? '1px solid rgb(214,216,218)' : 'white' }}><a href={item.route} className="nav-link">{item.name}</a></li>   
                                                            ))
                                                        }
                                                    </ul>
                                                </div>
                                            </li>

                                    
                                        :    <li key={_index} className="nav-item" >
                                                <a className={`nav-link ${isRoute(items.route)  ? 'active' : ''}`} href={items.route}>
                                                    <div className="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center">
                                                        <i className={`fa-solid ${items.icon} ${!isRoute(items.route) ? 'text-dark' : ''} fa-xl`}></i>
                                                    </div>
                                                    <span className="nav-link-text ms-1">{items.name}</span>
                                                </a>
                                            </li>
                                )
                            ))
                        }
                    </ul>
        
                </div>
                <div className="sidenav-footer mx-3 ">
                    <a onClick={onLogout} className="btn bg-gradient-primary mt-5 w-100" href="#">Signout</a>
                </div>
            </aside>
            <main className="main-content position-relative max-height-vh-100 h-100 border-radius-lg " style={{ overflowX: 'hidden' }}>
                <nav className="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl" id="navbarBlur" navbar-scroll="true">
                    <div className="container-fluid py-1 px-3">
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
                                {
                                    breadcrumb.segments.map((segment, index) => (
                                        index == 0 
                                            ?   <li key={index} className="breadcrumb-item text-sm disable"><a className="opacity-5 text-dark" href={breadcrumb.segments[0].route}>{ segment.label }</a></li>
                                            :   <li key={index} className="breadcrumb-item text-sm text-dark active" aria-current="page">{ segment.label }</li> 
                                    ))
                                }
                            </ol>
                            <h6 className="font-weight-bolder mb-0">{ breadcrumb.segments[breadcrumb.segments.length - 1].label }</h6>
                        </nav>
                        <div className="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4" id="navbar">
                            <ul className="navbar-nav ms-auto justify-content-end">
                                <li className="nav-item d-flex align-items-center">
                                    <a href="#">{ user.username }</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>
                <div className="container-fluid py-3">
                    <div className="row">
                        { children }
                    </div>
                    {/* <footer class="footer pt-3  ">
                        <div class="container-fluid">
                            <div class="row align-items-center justify-content-lg-between">
                                <div class="col-lg-6 mb-lg-0 mb-4">
                                    <div class="copyright text-center text-sm text-muted text-lg-start">
                                        © <script>
                                        document.write(new Date().getFullYear())
                                        </script>,
                                        made with <i class="fa fa-heart"></i> by
                                        <a href="https://www.creative-tim.com" class="font-weight-bold" target="_blank">Creative Tim</a>
                                        for a better web.
                                    </div>
                                </div>
                                <div class="col-lg-6">
                                    <ul class="nav nav-footer justify-content-center justify-content-lg-end">
                                        <li class="nav-item">
                                            <a href="https://www.creative-tim.com" class="nav-link text-muted" target="_blank">Creative Tim</a>
                                        </li>
                                        <li class="nav-item">
                                            <a href="https://www.creative-tim.com/presentation" class="nav-link text-muted" target="_blank">About Us</a>
                                        </li>
                                        <li class="nav-item">
                                            <a href="https://www.creative-tim.com/blog" class="nav-link text-muted" target="_blank">Blog</a>
                                        </li>
                                        <li class="nav-item">
                                            <a href="https://www.creative-tim.com/license" class="nav-link pe-0 text-muted" target="_blank">License</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </footer> */}
                </div>
            </main>
        </div>
        </>
    )
}

export default MainLayout