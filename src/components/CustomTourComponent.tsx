import Joyride from 'react-joyride';

class CustomJoyride extends Joyride {
    componentDidUpdate(previousProps, previousState) {
        // Llamar al método original de componentDidUpdate
        super.componentDidUpdate(previousProps, previousState);

        // Ahora agregamos el log que quieres
        console.log('componentDidUpdate fue ejecutado. Estado previo:', previousState);
        console.log('Estado actual:', this.state);
    }

    render() {
        return super.render(); // Renderizamos el componente Joyride original
    }
}

export default CustomJoyride;
