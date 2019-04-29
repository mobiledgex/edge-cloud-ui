import MakeFadesUp from './makeFadesUp';

const FadesUp = ( Component, arguments ) => {
    return (typeof arguments[0] === 'function')
    ? MakeFadesUp( arguments[0])
    : Component => MakeFadesUp( Component, arguments[0]);
}
export default FadesUp
