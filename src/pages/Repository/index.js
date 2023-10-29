import React, { useEffect, useState } from "react"
import { FaArrowLeft } from "react-icons/fa"
import { useParams } from "react-router-dom"
import { Container, Owner, Loading, BackButtton, IssuesList, PageActions, FilterList } from "./styles"
import api from "../../services/api"

export default function Repository() {
    const { repoName } = useParams()

    const [repository, setRepository] = useState({})
    const [issues, setIssues] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const [filters, setFilters] = useState([
        {state: "all", label:"Todas", active: true},
        {state: "open", label:"Abertas", active: false},
        {state: "closed", label:"Fechadas", active: false}
    ])
    const [filterIndex, setFilterIndex] = useState(0)

    useEffect(() => {
        async function load() {
            const nameRepo = decodeURIComponent(repoName)
            const [ repoData, issuesData ] = await Promise.all([
                api.get(`/repos/${nameRepo}`),
                api.get(`/repos/${nameRepo}/issues`, {
                    params: {
                        state: filters.find(f => f.active).state,
                        per_page: 5
                    }
                })
            ])

            setRepository(repoData.data)
            setIssues(issuesData.data)
            setLoading(false)
        }

        load()
    }, [])

    useEffect(() => {
        const nameRepo = decodeURIComponent(repoName)
        async function loadIssue() {
            const response = await api.get(`/repos/${nameRepo}/issues`, {
                params: {
                    state: filters[filterIndex].state,
                    page,
                    per_page: 5
                }
            })
            console.log(filters[filterIndex].state)
            console.log(response.data)
            setIssues(response.data)
        }

        loadIssue()
    }, [filters, filterIndex, page])

    function handlePage(action) {
        setPage(action === "back" ? page - 1 : page + 1)
    }

    function handleFilter(index) {
        setFilterIndex(index)
    }

    if(loading) {
        return(
            <Loading>
                <h1>Carregando...</h1>
            </Loading>
        )
    }

    return (
        <Container style={{color: "#fff"}}>
            <BackButtton to="/">
                <FaArrowLeft color="#000" size={30}/>
            </BackButtton>
            <Owner>
                <img 
                src={repository.owner.avatar_url} 
                alt={repository.owner.login}
                />
                <h1>{repository.name}</h1>
                <p>{repository.description}</p>
            </Owner>
            <FilterList active={filterIndex}>
                {filters.map((filter, index) => (
                    <button
                    type="button"
                    key={filter.label}
                    onClick={() => handleFilter(index)}
                    >
                        {filter.label}
                    </button>
                ))}
            </FilterList>
            <IssuesList>
                {issues.map(issue => (
                    <li key={String(issue.id)}>
                        <img src={issue.user.avatar_url} alt={issue.user.login}/>
                        <div>
                            <strong>
                                <a href={issue.html_url}>{issue.title}</a>
                                {issue.labels.map(label => (
                                    <span key={String(label.id)}>{label.name}</span>
                                ))}
                            </strong>
                            <p>{issue.user.login}</p>
                        </div>
                    </li>
                ))}
            </IssuesList>
            <PageActions>
                <button type="button" onClick={() => handlePage("back")} disabled={page < 2}>Voltar</button>
                <button type="button" onClick={() => handlePage("next")}>Proxima</button>
            </PageActions>
        </Container>
    )
}