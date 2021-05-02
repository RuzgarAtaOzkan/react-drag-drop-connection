
// MODULES
import React from 'react';

// STYLES
import './GridArea.scss';

class GridArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isDraggable: false, // determine wether a machine should follow the cursor pos, trigger on onMouseDown
            machines: [], // include the infos about the machine
            choosenMachine: 0, // choosen machine id
            updating: false, // just a dummy bool when I want to update the doms
        }

        this.machineElements = []; // acutal DOM Elements referring to machines div

        this.choosenMachine = null; // chosen machine DOM

        // binded functions
        this.onMachineDrag = this.onMachineDrag.bind(this);
        this.onMachineRelease = this.onMachineRelease.bind(this);
        this.onMachineDelete = this.onMachineDelete.bind(this);
        this.onSave = this.onSave.bind(this);
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

        const width = window.innerWidth;
        const height = window.innerHeight;

        const randomX = Math.floor(Math.random() * (width - width / 3) + 100) + 'px';
        const randomY = Math.floor(Math.random() * (height - height / 3) + 100) + 'px';

        console.log(randomX, randomY);

        const newMachine = {
            id: (maxValue + 1),
            name,
            connections: [],
            pos: {
                x: randomX,
                y: randomY
            },
            ref: React.createRef()
        };

        this.machineElements = [...this.machineElements, newMachine.ref];
        this.setState({ machines: [...this.state.machines, newMachine] });
    }

    onMachineDrag(e, machine) {
        this.setState({ isDraggable: true, choosenMachine: machine.id });
        this.choosenMachine = machine.ref;
    }

    onMachineRelease(e, machine) {
        this.setState({ isDraggable: false });
        // Update the choosen machine positions on mouse up
        const updatedMachines = this.state.machines.map((thisMachine) => {
            if (thisMachine.id === machine.id) {
                const { left, top } = this.choosenMachine.current.style;
                thisMachine.pos.x = left;
                thisMachine.pos.y = top;
            } 

            return thisMachine;
        });
        this.setState({ machines: updatedMachines });
    }

    onMachineDelete(e, machine) {

        this.setState({ 
            machines: this.state.machines.filter((thisMachine) => thisMachine.id !== machine.id) 
        });
        
    }

    renderMachines(machines) {
        return machines.map((machine, index) => {
            return (
                <div
                    key={index}
                    ref={machine.ref}
                    onMouseDown={(e) => this.onMachineDrag(e, machine)}
                    onMouseUp={(e) => this.onMachineRelease(e, machine)}
                    className="machine"
                    id={machine.id.toString()}
                    style={{ left: machine.pos.x, top: machine.pos.y }}
                >
                    {machine.name}
                    <button
                        onClick={(e) => this.onMachineDelete(e, machine)}
                    >
                        Delete
                    </button>
                </div>
            );
        });

    }

    onCursorMove(e) {
        if (this.choosenMachine && this.state.isDraggable) {
            
            const choosenMachine = this.choosenMachine.current;

            choosenMachine.style.left = e.screenX - 50 + 'px'; // TODO Automize the decrease value by getting the width of the machine
            choosenMachine.style.top = e.screenY - 150 + 'px';
        }
    }

    onSave() {
        const machinesInfo = this.state.machines.map((machine, index) => {

            if (!machine || !machine.ref || !machine.ref.current) {
                throw new Error('Machine is null');
            }

            const info = {
                id: machine.id,
                name: machine.name,
                pos: {
                    x: machine.ref.current.style.left,
                    y: machine.ref.current.style.top
                },
                createdAt: Date.now()
            }

            return info;
        });

        console.log(machinesInfo);
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

                    <button onClick={this.onSave}>
                        Save
                    </button>
                </div>
            </>
        );
    }
}

export default GridArea;

