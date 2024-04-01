const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;



function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" onClick="apiCalls(${pokemon.number})">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})


class PokemonPopup {
    constructor(nome, id, tipo, thumb, moves){
        this.nome=nome
        this.tipo=tipo
        this.id=id
        this.thumb=thumb
        this.moveList=moves
    }

    criarPopup(){
        console.log()
        const contentWarp = document.getElementById('popupWarpper')
        const popupContent = document.getElementById('popupContent')
        const moves = this.moveList
        const moveList = moves.map(e => { return `<li>${e.move.name}</li>`}).join('');
        const types = this.tipo
        const typeList = types.map((t, i) => { return `<span class="pill ${t.type.name}">${t.type.name}</span>`}).join('');
        const conteudo = `<div class="popupInner ${types[0].type.name}"><div class="content-flex between center "><h2>${this.nome}</h2><span class="num">${this.id}</span></div><div class="content-flex"><div class="pills">${typeList}</span></div></div><div class="content-flex between"><img src="${this.thumb}" alt=""><div class="moves"><h6>Move List</h6><ul>${moveList}</ul></div></div></div>`

        popupContent.innerHTML=conteudo
        contentWarp.classList.add('active')
    }
    
}

const popupClose = document.querySelector('.popup-close')
popupClose.addEventListener('click', ()=>{
    document.getElementById('popupWarpper').classList.remove('active')
})


async function apiCalls(i){
    const api = "https://pokeapi.co/api/v2/pokemon/"+i+"/"
    const resp = await fetch(api)

    if(resp.status === 200){
        const obj = await resp.json()
        console.log(obj)
        const nome = obj.name
        const tipo = obj.types
        const id = obj.id
        const img = obj.sprites.other.dream_world.front_default
        const move = obj.moves
        
        let pkm = new PokemonPopup(nome, id, tipo, img, move  )
        pkm.criarPopup()
        
    }
}