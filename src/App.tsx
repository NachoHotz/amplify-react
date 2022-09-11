import { API, graphqlOperation } from 'aws-amplify';
import { useEffect, useState } from 'react';
import { createTodo } from './graphql/mutations';
import { listTodos } from './graphql/queries';
import { withAuthenticator, Button, Heading } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import './App.css';

type Task = {
  id: string;
  name: string;
  description: string;
};

function App(user?: any, signOut?: any) {
  const [task, setTask] = useState({
    name: '',
    description: '',
  });

  const [tasks, setTasks] = useState<Array<Task>>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = await API.graphql(
      graphqlOperation(createTodo, { input: task }),
    );

    setTask({
      name: '',
      description: '',
    });

    console.log('Amplify createTodo result:', result);
  };

  const fetchTodos = async () => {
    const result: any = await API.graphql(graphqlOperation(listTodos));

    setTasks(result.data.listTodos.items);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <>
      <div>
        <Heading level={1}>Hello {user.username}</Heading>
        <Button onClick={signOut}>Sign out</Button>
        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: '2rem',
            gap: '1rem',
          }}
        >
          <div>
            <label style={{ marginTop: '0.5rem' }} htmlFor="taskTitle">
              Title:
            </label>
            <input
              type="text"
              name="taskTitle"
              id="taskTitle"
              style={{ marginLeft: '0.5rem' }}
              onChange={(e) => setTask({ ...task, name: e.target.value })}
            />
          </div>
          <div>
            <label htmlFor="description">Description: </label>
            <textarea
              name="description"
              id="description"
              onChange={(e) =>
                setTask({ ...task, description: e.target.value })
              }
            ></textarea>
          </div>
          <button type="submit">Submit</button>
        </form>
        <div>
          {tasks.map((task) => (
            <div key={task.id}>
              <h3>{task.name}</h3>
              <p>{task.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default withAuthenticator(App);
