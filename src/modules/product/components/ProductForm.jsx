import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { Button, Col, Row, Form, Modal, FormControl } from 'react-bootstrap'
import * as yup from 'yup'
import AxiosClient from '../../../shared/plugins/axios'
import FeatherIcon from 'feather-icons-react'
import Alert, {
    confirmMsj, confirmTitle, errorMsj, errorTitle, successMsj, successTitle
} from '../../../shared/plugins/alerts'


export const ProductForm = ({ isOpen, setProducts, onClose }) => {
    const [subCategories, setSubCategories] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const getSubCategories = async () => {
        try {
            setIsLoading(true)
            const data = await AxiosClient({
                url: '/subcategory/'
            })
            console.log(data.data);
            if (!data.error) setSubCategories(data.data)
        } catch (error) {
            //alerta de erro
            console.error('Error', error);
        } finally {
            setIsLoading(false)
        }
    }
    useEffect(() => {
        getSubCategories()
    }, [])

    const form = useFormik({
        initialValues: {
            name: "",
            description: "",
            price: 0,
            stock: 0,
            brand: "",
            subCategory: {
                id: 0
            },
        },
        validationSchema: yup.object().shape({
            name: yup
                .string()
                .required('Campo obligatorio')
                .min(4, 'Mínimo 4 caracteres'),
        }),
        onSubmit: async (values) => {
            Alert.fire({
                title: confirmTitle,
                text: confirmMsj,
                icon: 'warning',
                confirmButtonColor: '#009574',
                confirmButtonText: 'Aceptar',
                cancelButtonColor: '#DD6B55',
                cancelButtonText: 'Cancelar',
                reverseButtons: true,
                backdrop: true,
                showCancelButton: true,
                showLoaderOnConfirm: true,
                allowOutsideClick: () => !Alert.isLoading,
                preConfirm: async () => {
                    console.log(values);
                    try {
                        const response = await AxiosClient({
                            method: 'POST',
                            url: '/product/',
                            data: JSON.stringify(values),
                        })
                        if (!response.error) {
                            setProducts((products) => [response.data, ...products])
                            Alert.fire({
                                title: successTitle,
                                text: successMsj,
                                icon: 'success',
                                confirmButtonColor: '#3085d6',
                                confirmButtonText: 'Aceptar'
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    handleClose()
                                }
                            })
                        }
                        return response
                    } catch (error) {
                        Alert.fire({
                            title: errorTitle,
                            text: errorMsj,
                            icon: 'error',
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: 'Aceptar'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                handleClose()
                            }
                        })
                    }
                }

            })
        }
    })

    const handleClose = () => {
        form.resetForm()
        onClose()
    }

    return (
        <Modal
            backdrop='static'
            keyboard={false}
            show={isOpen}
            onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Registra Nuevo Producto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={form.handleSubmit}>
                    <Form.Group className='mb-2'>
                        <Form.Label>Nombre del producto</Form.Label>
                        <FormControl
                            name='name'
                            placeholder='Doritos Nacho'
                            value={form.values.name}
                            onChange={form.handleChange}
                        />
                        {
                            form.errors.name &&
                            (<span className='error-text'>
                                {form.errors.name}
                            </span>)
                        }
                    </Form.Group>

                    <Form.Group className='mb-3'>
                        <Form.Label>Marca</Form.Label>
                        <FormControl
                            name='brand'
                            placeholder='Barcel'
                            value={form.values.brand}
                            onChange={form.handleChange}
                        />
                        {
                            form.errors.brand &&
                            (<span className='error-text'>
                                {form.errors.brand}
                            </span>)
                        }
                    </Form.Group>
                    <Form.Group className='mb-3'>
                        <Form.Label>Descripción del producto</Form.Label>
                        <FormControl
                            as='textarea'
                            rows={2}
                            name='description'
                            placeholder='Ingrese una descripion del producto'
                            value={form.values.description}
                            onChange={form.handleChange}
                        />
                        {
                            form.errors.description &&
                            (<span className='error-text'>
                                {form.errors.description}
                            </span>)
                        }
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Subcategoria a la que pertenece</Form.Label>
                        <Form.Control as="select"
                            name="subCategory.id"
                            value={form.values.subCategory.id}
                            onChange={form.handleChange}
                        >
                            <option>Selecciona una Subcategoria</option>
                            {subCategories.map(subCategory => (
                                <option
                                    key={subCategory.id}
                                    value={subCategory.id}
                                    onChange={form.handleChange}
                                >
                                    {subCategory.name}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group className='mb-2'>
                        <Form.Label>Precio</Form.Label>
                        <FormControl
                            type='number'
                            name='price'
                            placeholder='15.0'
                            value={form.values.price}
                            onChange={form.handleChange}
                        />
                        {
                            form.errors.price &&
                            (<span className='error-text'>
                                {form.errors.price}
                            </span>)
                        }
                    </Form.Group>
                    <Form.Group className='mb-2'>
                        <Row>
                            <Col className='text-end'>
                                <Button className='me-2' variant='outline-danger' onClick={handleClose}>
                                    <FeatherIcon icon='x' />&nbsp;Cerrar
                                </Button>
                                <Button type='submit' variant='outline-success'>
                                    <FeatherIcon icon='check' />&nbsp;Guardar
                                </Button>
                            </Col>
                        </Row>
                    </Form.Group>
                </Form>
            </Modal.Body>
        </Modal>)
}
