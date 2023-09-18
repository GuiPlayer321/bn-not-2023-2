import express, { json, urlencoded } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";

import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";

const app = express();

app.use(logger("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/users", usersRouter);

import cursoRoute from './routes/curso.js'
app.use('/curso', cursoRoute)

import professorRoute from './routes/professor.js'
app.use('/professor', professorRoute)

import turmaRoute from './routes/turma.js'
app.use('/turma', turmaRoute)

import alunoRoute from './routes/aluno.js'
app.use('/aluno', alunoRoute)

export default app;
