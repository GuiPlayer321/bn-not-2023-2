import { Router } from "express";
import controller from "../controllers/turma.js";

const router = Router();

router.post('/', controller.create);
router.get('/', controller.retrieveAll)
router.get('/:id', controller.retrieveOne)
router.put('/:id', controller.update)
router.delete('/:id', controller.delete)

router.put('/:turmaId/aluno/:alunoId', controller.addAluno)
router.delete('/:turmaId/aluno/:alunoId', controller.removeAluno)

export default router;