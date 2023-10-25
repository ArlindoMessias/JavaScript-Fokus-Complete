const taskListContainer = document.querySelector('.app__section-task-list')//selecionar o elemento lista UL da página

const formTask = document.querySelector('.app__form-add-task')//buscar elemento do formulario
const toggleFormTaskBtn = document.querySelector('.app__button--add-task')//buscar botao + do formulario
const formLabel = document.querySelector('.app__form-label')//buscar elemento label do formulario

const textArea = document.querySelector('.app__form-textarea')

const formCancelarBtn=document.querySelector('.app__form-footer__button--cancel')

const btnDeletar = document.querySelector('.app__form-footer__button--delete')

const btnDeletarConcluidas = document.querySelector('#btn-remover-concluidas')
const btnDeletarTodas = document.querySelector('#btn-remover-todas')


const localStorageTarefas=localStorage.getItem('tarefas')//pegar os itens do localstorage
let tarefas= localStorageTarefas ? JSON.parse(localStorageTarefas) : [] //verifica se tem algo no localstorage e formata para um objeto JS 

const taskAtiveDescription = document.querySelector('.app__section-active-task-description')//local onde será colocado o titulo da tarefa selecionada

const taskIconSvg = //criação do icone
`
<svg class="app_section-task-icon-status" width="24" height="24" viewBox="0 0 24 24"
    fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill="#FFF" />
<path
    d = "M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L19 26.17192"
    fill="#01080E" />
</svg>
`

let tarefaSelecionada = null //variaveis para criar seleçao
let itemTarefaSelecionada = null

let tarefaEmEdicao = null
let paragraphEmEdicao = null

const removerTarefas = (somenteConcluidas) => {
    //define seletor usando operador ternario
    const seletor = somenteConcluidas ? '.app__section-task-list-item-complete' : '.app__section-task-list-item'
    // para somenteConcluidas = true, o seletor será .app__section-task-list-item-complete': so tarefas as concluidas
    //para somenteConcluidas = false, o seletor será '.app__section-task-list-item': todas as tarefas
    document.querySelectorAll(seletor).forEach((element) => {
        element.remove();//remove todos os elementos do DOM selecionados pelo seletor
    });
    tarefas = somenteConcluidas ? tarefas.filter(t => !t.concluida) : []
    //se somenteConcluidas=true, então tarefas recebe apenas as tarefas não concluidas
    //se somenteConcluidas=false, então tarefas recebe apenas um array vazio, pois todas as tarefas foram removidas
    updateLocalStorage()//atualiza o localStorage
    
}


const selecionaTarefa = (tarefa, elemento) => {

    if(tarefa.concluida){
        return
    }

    document.querySelectorAll('.app__section-task-list-item-active').forEach(function (button) {
        button.classList.remove('app__section-task-list-item-active')
    })

    if (tarefaSelecionada == tarefa) {
        taskAtiveDescription.textContent = null
        itemTarefaSelecionada = null
        tarefaSelecionada = null
        return
    }

    tarefaSelecionada = tarefa
    itemTarefaSelecionada = elemento
    taskAtiveDescription.textContent = tarefa.descricao
    elemento.classList.add('app__section-task-list-item-active')
}

const limparForm=()=>{
    tarefaEmEdicao=null //para editar sem sobrescrever nada
    paragraphEmEdicao=null
    textArea.value=''
    formTask.classList.add('hidden')
}

const selecionaTarefaParaEditar = (tarefa, elemento)=>{
    if(tarefaEmEdicao==tarefa){
        limparForm()//limpar descricao da tarefa quando editar
        return
    }

    formLabel.textContent='Editando tarefa'//label para o form indicando a edicao e nao criacao
    tarefaEmEdicao=tarefa
    paragraphEmEdicao=elemento //mandado posteriormente para o LS
    textArea.value=tarefa.descricao
    formTask.classList.remove('hidden') //aparecer form ao clicar no botao
}

//criar tarefa    
function createTask(tarefa){
    const li = document.createElement('li')//criar elemento da lista
    li.classList.add('app__section-task-list-item')//add classe ao elemento lista

    const svgIcon = document.createElement('svg')
    svgIcon.innerHTML=taskIconSvg //add icone no elemento svg html

    const paragraph = document.createElement('p')
    paragraph.classList.add('app__section-task-list-item-description')//add descriçao do item

    paragraph.textContent = tarefa.descricao //pega a descriçao e coloca no paragraph

    const button = document.createElement('button')//criar botao
    
    button.classList.add('app_button-edit')//cria classe para o botao

    const editIcon = document.createElement('img') //cria elemento img
    editIcon.setAttribute('src', './imagens/edit.png') //addd atributos para o elemento img

    button.appendChild(editIcon) //add o elemento img como filho de button <button><img></button>

    button.addEventListener('click', (event) => {
        event.stopPropagation()
        selecionaTarefaParaEditar(tarefa, paragraph)
    })

    li.onclick = () => {//quando clicar no item da lista, a funçao selecionaTarefa sera chamada
        selecionaTarefa(tarefa, li)
    }

    svgIcon.addEventListener('click', (event) => {
        if(tarefa==tarefaSelecionada){
            event.stopPropagation()
            button.setAttribute('disabled', true)
            li.classList.add('app__section-task-list-item-complete')
            tarefaSelecionada.concluida=true
            updateLocalStorage()
        }
        
    })

    if(tarefa.concluida){
        button.setAttribute('disabled', true)
        li.classList.add('app__section-task-list-item-complete')
    }

    li.appendChild(svgIcon)//add svg como filho de li
    li.appendChild(paragraph)//add paragraph como filho de li
    li.appendChild(button)
    return li
}

tarefas.forEach(task=> { //percorre os item do array lista
                        //cada elemento do array é a 'task'
    const taskItem = createTask(task)//cria a tarefa com o item do array
    taskListContainer.appendChild(taskItem) //adiciona as tarefas na lista container
})

toggleFormTaskBtn.addEventListener('click', ()=>{//funçao para executar ao click do botao form
    formLabel.textContent= 'Adicionando tarefa'//texto de fundo do formulario
    formTask.classList.toggle('hidden')// mostrar formulario
})


btnDeletar.addEventListener('click', ()=>{
    if(tarefaSelecionada){
        const index = tarefas.indexOf(tarefaSelecionada)
        if(index !==-1){
            tarefas.splice(index,1)
        }

        itemTarefaSelecionada.remove()
        tarefas.filter(t=> t!= tarefaSelecionada)
        itemTarefaSelecionada =null
        tarefaSelecionada=null
    }
    updateLocalStorage()
    limparForm()
})

const updateLocalStorage = () =>{
    localStorage.setItem('tarefas', JSON.stringify(tarefas))//transforma um obejto JS em string
}

formTask.addEventListener('submit', (evento)=>{
    evento.preventDefault()

    if(tarefaEmEdicao){
        tarefaEmEdicao.descricao=textArea.value
        paragraphEmEdicao.textContent= textArea.value
    }
    else{
        const task = {
            descricao:textArea.value,//valor digitado no form
            concluida: false
        }

        tarefas.push(task)//add nova tarefa na lista
        const taskItem=createTask(task)//criar lista atualizada
        taskListContainer.appendChild(taskItem)//mostrar na pagina
    }
    updateLocalStorage()
    limparForm()
    textArea.value=''
})

formCancelarBtn.addEventListener('click', ()=>{
    textArea.value=''
    formTask.classList.toggle('hidden')// mostrar formulario
})

console.log(localStorage.getItem('tarefa'))


btnDeletarConcluidas.addEventListener('click', () => removerTarefas(true))
btnDeletarTodas.addEventListener('click', () => removerTarefas(false))

document.addEventListener('TarefaFinalizada', function(e){
    if(tarefaSelecionada){
        tarefaSelecionada.concluida=true
        itemTarefaSelecionada.classList.add('app__section-task-list-item-complete')
        itemTarefaSelecionada.querySelector('button').setAttribute('disabled', true)
        updateLocalStorage()
    }
})


