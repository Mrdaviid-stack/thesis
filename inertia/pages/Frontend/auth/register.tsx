import { router } from "@inertiajs/react";
import { Form, Formik, FormikHelpers } from "formik";
import { ReactNode, useState } from "react";
import * as Yup from "yup";
import { Toast } from "~/helpers/Toast";
import { requestService } from "~/services/api.service";
import Cookie from "js-cookie";
import { Input } from "~/components/Forms/Input";
import ShopLayout from "~/components/Layouts/shop";

interface IFormValue {
    lastname: string
    firstname: string
    email: string
    address: string
    group?: number | string
}

const LoginSchema = Yup.object().shape({
    firstname: Yup.string().required().min(2, 'Identity is too short.'),
    lastname: Yup.string().required().min(5, 'Identity is too short.'),
    email: Yup.string().required().email(),
    address: Yup.string().required().min(5, 'Identity is too short.'),
})

export default function Register() {
    const [error, setError] = useState(null)
    return (
        <div className="d-flex justify-content-end w-25 ">
        <div className="card card-body d-flex w-25 position-absolute" style={{ top: '25%', left: '40%' }}>
        <h6>Sign in</h6>
        <Formik
            initialValues={{
                firstname: '',
                lastname: '',
                email: '',
                address: '',
                group: 3
            }}
            validationSchema={LoginSchema}
            onSubmit={async (values: any, actions: FormikHelpers<any>) => {
                requestService({
                    url: '/dashboard/admin/users/add',
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
                        router.visit('/shop')
                    })
                    .catch(error => {
                        console.log(error)
                        setError(error.response.data.errors[0].message)
                        actions.setSubmitting(false)
                    })
            }}
        >
            {() => (
                <Form>
                    <Input
                        id="firstname"
                        name="firstname"
                        label="firstname"
                        className="form-control"
                    />
                    <Input
                        id="lastname"
                        name="lastname"
                        label="Lastname"
                        className="form-control"
                    />
                    <Input
                        id="email"
                        name="email"
                        label="Email"
                        className="form-control"
                    />
                    <Input
                        id="address"
                        name="address"
                        label="Address"
                        className="form-control"
                    />
                    <button className="btn btn-primary ">Sign up</button>
                </Form>
            )}
        </Formik>
        </div>
        </div>
    )
}

Register.layout = (page: ReactNode) => <ShopLayout children={page} title='Sign up' />