import React, { useCallback, useEffect, useState } from "react";
import { FaBars, FaGithub, FaPlus, FaSpinner, FaTrash } from "react-icons/fa"
import { Container, Form, SubmitButton, List, DeleteButton } from "./styles"
import api from "../../services/api";
import { Link } from "react-router-dom";

export default function Main() {
    const [newRepo, setNewRepo] = useState("")
    const [repositories, setRepositories] = useState([])
    const [loading, setLoading] = useState(false)
    const [alert, setAlert] = useState(false)

    useEffect(() => {
        const repoStorage = localStorage.getItem("repos")
        if(repoStorage) {
            setRepositories(JSON.parse(repoStorage))
        }
    }, [])

    useEffect(() => {
        localStorage.setItem("repos", JSON.stringify(repositories))
    }, [repositories])

    const handleSubmit = useCallback((e) => {
        e.preventDefault()

        async function submit() {
            setLoading(true)
            setAlert(false)
            try {
                if(!newRepo) {
                    throw new Error("Você precisa indicar um repositório!")
                }

                const response = await api.get(`repos/${newRepo}`)

                const hasRepo = repositories.find(repo => repo.name === newRepo)
                if(hasRepo) {
                    throw new Error("Repositório duplicado")
                }

                const data = {
                    name: response.data.full_name
                }
                setRepositories([...repositories, data])
                setNewRepo('')
            } catch(error) {
                setAlert(true)
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        submit()
    }, [newRepo, repositories])

    function handleInputChange(e) {
        setNewRepo(e.target.value)
        setAlert(false)
    }

    const handleDelete = useCallback((repo) => {
        const find = repositories.filter(r => r.name !== repo)
        setRepositories(find)
    }, [repositories])

    return (
        <Container>
            <h1>
                <FaGithub size={25}/>
                Meus Repositorios
            </h1>

            <Form onSubmit={handleSubmit} error={alert}>
                <input 
                type="text" 
                placeholder="Adicionar Repositorios" 
                value={newRepo}
                onChange={handleInputChange}
                />
                <SubmitButton Loading={loading ? 1 : 0}>
                    {
                        loading ? (
                            <FaSpinner color="#FFF" size={14}/>
                        ) : (
                            <FaPlus color="#FFF" size={14}/>
                        )
                    }
                </SubmitButton>
            </Form>

            <List>
                {repositories.map(repo => {
                    return (
                        <li key={repo.name}>
                            <span>
                                <DeleteButton onClick={() => handleDelete(repo.name)}>
                                    <FaTrash size={14}/>
                                </DeleteButton>
                                {repo.name}
                            </span>
                            <Link to={`/repository/${encodeURIComponent(repo.name)}`}>
                                <FaBars size={20}/>
                            </Link>
                        </li>
                    )
                })}
            </List>
        </Container>
    )
}