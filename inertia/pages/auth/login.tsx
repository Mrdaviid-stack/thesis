import { ReactNode, useState } from "react"
import AuthLayout from "~/components/Layouts/auth"
import { Formik, Field, Form, FormikProps, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import Cookie from 'js-cookie'
import { requestService } from "~/services/api.service"
import { router } from "@inertiajs/react"
import { Toast } from "~/helpers/Toast"

interface IFormValue {
    identity: string
    password: string
}

const LoginSchema = Yup.object().shape({
    identity: Yup.string().required().min(2, 'Identity is too short.'),
    password: Yup.string().required().min(5, 'Identity is too short.')
})

export default function Login() {
    const [error, setError] = useState(null)
    return (
        <main className="main-content  mt-0">
            <section>
                <div className="page-header min-vh-75">
                    <div className="container">
                        <div className="row">
                            <div className="col-xl-4 col-lg-5 col-md-6 d-flex flex-column mx-auto">
                                <div className="card card-plain mt-8">
                                    <div className="card-header pb-0 text-left bg-transparent">
                                        <h3 className="font-weight-bolder text-info text-gradient">Welcome back</h3>
                                        <p className="mb-0">Enter your email and password to sign in</p>
                                        </div>
                                    <div className="card-body">
                                        { error !== null ? <div className="text-danger">{ error }</div> : '' }
                                        <Formik
                                            initialValues={{
                                                identity: '',
                                                password: '',
                                            }}
                                            validationSchema={LoginSchema}
                                            onSubmit={async (values: IFormValue, actions: FormikHelpers<IFormValue>) => {
                                                requestService({
                                                    url: '/dashboard/login',
                                                    method: 'post',
                                                    payload: values
                                                })
                                                    .then(response => {
                                                        Cookie.set('token', response.data.token.headers.authorization.toString().split(' ')[1], { expires: 1/24 })
                                                        Cookie.set('user', response.data.user)
                                                        Toast.fire({
                                                            icon: 'success',
                                                            text: `Welcome ${JSON.parse(response.data.user)[0].username}`
                                                        })
                                                        if (JSON.parse(response.data.user)[0].groups[0].name !== 'customers')
                                                            router.visit('/dashboard')
                                                        else router.visit('/shop')
                                                    })
                                                    .catch(error => {
                                                        setError(error.response.data.errors[0].message)
                                                        actions.setSubmitting(false)
                                                    })
                                            }}
                                        >
                                            {({ errors, touched }: FormikProps<IFormValue>) => (
                                                <Form>
                                                    <label htmlFor="identity">Identity</label>
                                                    <div className="mb-3">
                                                        <Field
                                                            id="identity" 
                                                            name="identity"
                                                            type="text" 
                                                            className="form-control" 
                                                            placeholder="email or password" 
                                                            aria-label="identity" 
                                                            aria-describedby="identity"
                                                        />
                                                        {errors.identity && touched.identity ? ( <div className="text-danger">{ errors.identity }</div> ) : null}
                                                    </div>
                                                    <label htmlFor="password">Password</label>
                                                    <div className="mb-3">
                                                        <Field
                                                            id="password" 
                                                            name="password"
                                                            type="password" 
                                                            className="form-control" 
                                                            placeholder="Password" 
                                                            aria-label="Password" 
                                                            aria-describedby="password-addon"
                                                        />
                                                        {errors.password && touched.password ? ( <div className="text-danger">{ errors.password }</div> ) : null}
                                                    </div>
                                                    <div className="text-center">
                                                        <button type="submit" className="btn bg-gradient-info w-100 mt-4 mb-0">Sign in</button>
                                                    </div>
                                                </Form>
                                            )}
                                        </Formik>
                
                                        {/* <form role="form">
                                            <label>Email</label>
                                            <div className="mb-3">
                                                <input 
                                                    type="email" 
                                                    className="form-control" 
                                                    placeholder="Email" 
                                                    aria-label="Email" 
                                                    aria-describedby="email-addon"
                                                    v-model="formData.identity"
                                                />
                                            </div>
                                            <label>Password</label>
                                            <div className="mb-3">
                                                <input 
                                                    type="password" 
                                                    className="form-control" 
                                                    placeholder="Password" 
                                                    aria-label="Password" 
                                                    aria-describedby="password-addon"
                                                    v-model="formData.password"
                                                />
                                            </div>
                                            <div className="form-check form-switch">
                                            <input className="form-check-input" type="checkbox" id="rememberMe" />
                                            <label className="form-check-label" htmlFor="rememberMe">Remember me</label>
                                            </div>
                                            <div className="text-center">
                                            <button type="submit" className="btn bg-gradient-info w-100 mt-4 mb-0">Sign in</button>
                                            </div>
                                        </form> */}
                                    </div>
                                    <div className="card-footer text-center pt-0 px-lg-2 px-1">
                                        <p className="mb-4 text-sm mx-auto">
                                            Don't have an account?
                                            <a href="/" className="text-info text-gradient font-weight-bold">Sign up</a>
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="oblique position-absolute top-0 h-100 d-md-block d-none me-n8">
                                    <div className="oblique-image bg-cover position-absolute fixed-top ms-auto h-100 z-index-0 ms-n6" ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}

Login.layout = (page: ReactNode) => <AuthLayout children={page} />