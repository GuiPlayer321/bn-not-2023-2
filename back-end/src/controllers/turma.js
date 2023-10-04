import prisma from "../database/client.js";

const controller = {};

controller.create = async function (req, res) {
  try {
    await prisma.turma.create({ data: req.body });
    res.status(201).end();
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

controller.retrieveAll = async function (req, res) {
  try {
    let include = {};
    if (req.query.professor) include.professor = true;
    if (req.query.curso) include.curso = true;
    if (req.query.alunos) include.alunos = true;
    const result = await prisma.turma.findMany({
      include,
      orderBy: [{ diaSemana: "asc" }, { horaInicial: "asc" }],
    });
    res.send(result);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

controller.retrieveOne = async function (req, res) {
  try {
    const result = await prisma.turma.findUnique({
      where: { id: req.params.id },
    });
    if (result) res.send(result);
    else res.status(404).end();
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

controller.update = async function (req, res) {
  try {
    const result = await prisma.turma.update({
      where: { id: req.params.id },
      data: req.body,
    });
    if (result) res.status(204).end();
    else res.status(404).end();
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

controller.delete = async function (req, res) {
  try {
    const result = await prisma.turma.delete({
      where: { id: req.params.id },
    });
    if (result) res.status(204).end();
    else res.status(404).end();
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
};

controller.addAluno = async function(req, res) {
  try {
    
    // Busca o aluno para recuperar a lista de ids de turmas dele
    const turma = await prisma.turma.findUnique({
      where: { id: req.params.turmaId }
    })

    // Se ele não tiver turmas ainda, criamos a lista vazia
    const alunoIds = turma.alunoIds || []

    // Se o id de turma passado ainda não estiver na lista do
    // aluno, fazemos a respectiva inserção
    if(! alunoIds.includes(req.params.alunoId))
      alunoIds.push(req.params.alunoId)

    // Atualizamos o aluno com uma lista de ids de turma atualizada  
    const result = await prisma.turma.update({
      where: { id: req.params.turmaId },
      data: { alunoIds }
    })

    // Encontrou e atualizou ~> retorna HTTP 204: No content
    if(result) res.status(204).end()
    // Não encontrou (e não atualizou) ~> retorna HTTP 404: Not found
    else res.status(404).end()

  }
  catch(error) {
    // Deu errado: exibe o erro no console do back-end
    console.error(error)
    // Envia o erro ao front-end, com status 500
    // HTTP 500: Internal Server Error
    res.status(500).send(error)
  }
}


controller.removeAluno = async function(req, res) {
  try {

    // Busca a turma para recuperar a lista de ids de alunos dela
    const turma = await prisma.turma.findUnique({
      where: { id: req.params.turmaId }
    })

    // Não encontrou a turma, ou a turma não tem alunos
    // associados a ele ~> HTTP 404: Not Found
    if(! turma || ! turma.alunoIds) res.send(404).end()

    // Procura, na lista de ids de aluno da turma, se existe o id
    // de aluno passado para remoção
    for(let i = 0; i < turma.alunoIds.length; i++) {
      // Encontrou
      if(turma.alunoIds[i] === req.params.alunoId) {
        // Remove o id que foi passado da lista de ids de alunos
        turma.alunoIds.splice(i, 1)

        // Faz a atualização na turma, alterando o conteúdo de alunoIds
        const result = await prisma.turma.update({
          where: { id: req.params.turmaId },
          data: { alunoIds: turma.alunoIds }
        })

        // Encontrou e atualizou ~> retorna HTTP 204: No content
        if(result) return res.status(204).end()
        // Não encontrou (e não atualizou) ~> retorna HTTP 404: Not found
        else return res.status(404).end()
      
      }
    }

    // Se chegou até aqui, é porque não existe o id da turma passado
    // na lista de ids de turma do aluno ~> HTTP 404: Not found
    return res.status(404).end()    

  }
  catch(error) {
    // Deu errado: exibe o erro no console do back-end
    console.error(error)
    // Envia o erro ao front-end, com status 500
    // HTTP 500: Internal Server Error
    res.status(500).send(error)
  }
}

export default controller;
