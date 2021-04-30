
import React from 'react';

// STYLES
import './GridArea.scss';

class GridArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isDraggable: false,
            machines: [],
            choosenMachine: 0
        }

        this.createMachine = this.createMachine.bind(this);
        this.onCursorMove = this.onCursorMove.bind(this);
    }

    createMachine(name) {
        let maxValue = 0;

        this.state.machines.forEach(machine => {
            if (machine.id > maxValue) {
                maxValue = machine.id
            }
        });

        const newMachine = {
            id: (maxValue + 1),
            name,
            ref: React.createRef()
        };

        this.setState({ machines: [...this.state.machines, newMachine] });
    }

    renderMachines(machines) {
        return machines.map((machine, index) => {
            return (
                <div
                    key={index}
                    ref={machine.ref}
                    onMouseDown={(e) => {
                        this.setState({ isDraggable: true, choosenMachine: machine.id });
                    }}
                    onMouseUp={(e) => {
                        const choosenMachine = this.state.machines.find((machine) => machine.id === this.state.choosenMachine);
                        choosenMachine.ref.current.style.left = e.screenX - (e.screenX % 100) - 50 + 'px';
                        //e.screenX - (e.screenX % 50) - 50 + 'px';
                        choosenMachine.ref.current.style.top = e.screenY - (e.screenY % 100) - 150 + 'px';
                        //e.screenY - (e.screenY % 50) - 150 + 'px';
                        this.setState({ isDraggable: false });
                    }}
                    className="machine"
                >
                    {machine.name}
                </div>
            );
        });

    }

    onCursorMove(e) {
        if (this.state.choosenMachine && this.state.isDraggable) {
            const choosenMachine = this.state.machines.find((machine) => machine.id === this.state.choosenMachine);
            choosenMachine.ref.current.style.left = e.screenX - 50 + 'px';
            //e.screenX - (e.screenX % 50) - 50 + 'px';
            choosenMachine.ref.current.style.top = e.screenY - 150 + 'px';
            //e.screenY - (e.screenY % 50) - 150 + 'px';
        }
    }

    render() {
        return (
            <>
                <div 
                    className="grid"
                    onMouseMove={this.onCursorMove}
                >
                    <ul>
                        <li>
                            <a 
                                href="#"
                                onClick={() => this.createMachine('Linux')}
                            >
                                Linux
                            </a>
                        </li>
                        <li>
                            <a 
                                href="#"
                                onClick={() => this.createMachine('Windows')}
                            >
                                Windows
                            </a>
                        </li>
                        <li>
                            <a 
                                href="#"
                                onClick={() => this.createMachine('MacOS')}
                            >
                                MacOS
                            </a>
                        </li>
                    </ul>

                    {this.renderMachines(this.state.machines)}

                    <button
                        onClick={() => {
                            this.state.machines.forEach((machine, index) => {
                                console.log(machine, machine.ref.current.style.top);

                                if (!machine || !machine.ref || !machine.ref.current) {
                                    throw new Error('Machine is null');
                                }

                                const _machine = {
                                    id: machine.id,
                                    name: machine.name,
                                    pos: {
                                        x: machine.ref.current.style.left,
                                        y: machine.ref.current.style.top
                                    },
                                    createdAt: Date.now()
                                }

                                console.log(_machine);
                                
                            });
                        }}
                    >
                        Save
                    </button>
                </div>
            </>
        );
    }
}

export default GridArea;

