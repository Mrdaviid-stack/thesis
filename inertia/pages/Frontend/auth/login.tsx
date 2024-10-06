import { ReactNode, useState } from "react";
import { Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Toast } from "~/helpers/Toast";
import { requestService } from "~/services/api.service";
import Cookie from "js-cookie";
import { Input } from "~/components/Forms/Input";
import ShopLayout from "~/components/Layouts/shop";

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
        <div className="d-flex justify-content-end w-25 ">
            <div className="card card-body d-flex w-25 position-absolute" style={{ top: '25%', left: '40%' }}>
            <h6>Sign in</h6>
            <p>{error}</p>
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
                            if (JSON.parse(response.data.user)[0].group !== 'Customers') {
                                Toast.fire({
                                    icon: 'error',
                                    text: 'You are not authorized to access this page.'
                                })
                                return
                            }
                            Cookie.set('token', response.data.token.headers.authorization.toString().split(' ')[1], { expires: 1/24 })
                            Cookie.set('user', response.data.user)
                            setTimeout(() => {
                                Toast.fire({
                                    icon: 'success',
                                    text: `Welcome ${JSON.parse(response.data.user)[0].username}`
                                })
                                window.location.href = '/shop'
                            }, 500)
                        })
                        .catch(error => {
                            setError(error.response.data.errors[0].message)
                            actions.setSubmitting(false)
                        })
                }}
            >
                {() => (
                    <Form>
                        <Input
                            id="identity"
                            name="identity"
                            label="Email"
                            className="form-control"
                        />
                        <Input
                            id="password"
                            name="password"
                            label="Password"
                            type="password"
                            className="form-control"
                        />
                        <button className="btn btn-primary ">Sign in</button>
                        <br />
                        <small><a href="/shop/auth/register">Don't have account?</a></small>
                    </Form>
                )}
            </Formik>
            </div>
        </div>
    )
}

Login.layout = (page: ReactNode) => <ShopLayout children={page} title='Sign in' />