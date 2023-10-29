import React from "react"
import { BrowserRouter, Route, Routes as RoutesRD } from "react-router-dom"
import Main from "./pages/Main"
import Repository from "./pages/Repository"

export default function Routes() {
    return (
        <BrowserRouter>
            <RoutesRD>
                <Route exact path="/" Component={Main} />
                <Route exact path="/repository/:repoName" Component={Repository} />
            </RoutesRD>
        </BrowserRouter>
    )
}