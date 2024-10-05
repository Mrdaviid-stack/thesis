import { ReactNode } from 'react'
import MainLayout from '~/components/Layouts/main'

export default function Home(props: { version: number, users: number, pages: number }) {

    return (
        <>
            <div className="row">
                <div className="col">
                    <div className="card card-body">
                        <h5>USERS</h5>
                        <p>{props.users}</p>
                    </div>
                </div>
                <div className="col">
                <div className="card card-body">
                        <h5>PAGES</h5>
                        <p>{props.pages}</p>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="title">AdonisJS {props.version} x Inertia x React</div>

                <span>
                    Learn more about AdonisJS and Inertia.js by visiting the{' '}
                    <a href="https://docs.adonisjs.com/guides/inertia">AdonisJS documentation</a>.
                </span>
            </div>
        </>
    )
}

Home.layout = (page: ReactNode) => <MainLayout children={page} title='Dashboard' />