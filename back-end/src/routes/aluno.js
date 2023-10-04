import { Router } from "express";
import controller from "../controllers/aluno.js";

const router = Router();

router.post('/', controller.create);
router.get('/', controller.retrieveAll)
router.get('/:id', controller.retrieveOne)
router.put('/:id', controller.update)
router.delete('/:id', controller.delete)

router.put('/:alunoId/turma/:turmaId', controller.addTurma)
router.delete('/:alunoId/turma/:turmaId', controller.removeTurma)

export default router;