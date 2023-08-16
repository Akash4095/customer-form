import React,{Component} from 'react';
import {Route} from 'react-router';
import CreateTask from "../tasks/containers/createTask";
import EditTask from "../tasks/containers/editTask";
import TasksList from "../tasks/components/list-tasks";

class TasksRouter extends Component {
    render(){
        return (
            <div>
                <Route path="/tasks/list" component={TasksList} />
                <Route path="/tasks/edit/:id" component={EditTask} />
                <Route path="/tasks/create" component={CreateTask} />
            </div>
        );
    }
}

export default TasksRouter;