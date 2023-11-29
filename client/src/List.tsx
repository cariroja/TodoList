import { MouseEvent } from "react"
import { TTodoRestItem, TSubItem } from "./App"

type TSubItemProps = {
  subitems?: TSubItem[];
  onAddSubitem: () => void;
  onUpdateSubitem: (subitemId: number, text: string) => void;
  onRemoveSubitem: (subitemId: number) => void;
};

const SubItem: React.FC<TSubItemProps> = ({ subitems, onAddSubitem, onUpdateSubitem, onRemoveSubitem }) => {
  return (
    <div className="subitem-container">
    <ul className="subitem-list">
      {subitems?.map((subitem) => (
        <li key={subitem.id}>
          <input
            type="text"
            defaultValue={subitem.text}
            onBlur={(e) => onUpdateSubitem(subitem.id, e.target.value)}
          />
          <button onClick={() => onRemoveSubitem(subitem.id)}>Remover</button>
        </li>
      ))}
      <li>
        <button id="add-subitem" onClick={onAddSubitem}>Add Subitem</button>
      </li>
    </ul>
    </div>
  );
};

type TProps = {
  todolist: TTodoRestItem[];
  setTodolist: (todolist: TTodoRestItem[]) => void;
};

const List: React.FC<TProps> = (props) => {
  const { todolist, setTodolist } = props;

  const removeItem = async (event: MouseEvent<HTMLButtonElement>) => {
    const id = Number(event.currentTarget.dataset.id) as number
    const li = event.currentTarget.closest('li') as HTMLLIElement
    li.className = 'pending'
    await fetch(`http://localhost:3000/item/${id}`, { method: 'DELETE' })
    const newTodolist = todolist.filter((val, _key) => val.id !== id)
    setTodolist(newTodolist)
  }



  const addSubitem = (id: number) => {
    const newTodolist = todolist.map((todo) => {
      if (todo.id === id) {
        const updatedSubitems = [...(todo.subitems || []), { id: Date.now(), text: "" }];
        return {
          ...todo,
          subitems: updatedSubitems,
        };
      }
      return todo;
    });
    setTodolist(newTodolist);
  };

  const updateSubitem = (itemId: number, subitemId: number, text: string) => {
    const newTodolist = todolist.map((todo) => {
      if (todo.id === itemId && todo.subitems) {
        const updatedSubitems = todo.subitems.map((subitem) => {
          if (subitem.id === subitemId) {
            return { ...subitem, text };
          }
          return subitem;
        });
        return {
          ...todo,
          subitems: updatedSubitems,
        };
      }
      return todo;
    });
    setTodolist(newTodolist);
  };

  const removeSubitem = (itemId: number, subitemId: number) => {
    const newTodolist = todolist.map((todo) => {
      if (todo.id === itemId && todo.subitems) {
        const updatedSubitems = todo.subitems.filter((subitem) => subitem.id !== subitemId);
        return {
          ...todo,
          subitems: updatedSubitems,
        };
      }
      return todo;
    });
    setTodolist(newTodolist);
  };

  return (
    <ul className="main-list">
      {todolist.map((todo) => (
        <li key={todo.id} ref={todo.ref} data-id={todo.id} className={todo.id < 0 ? "pending" : "synced"}>
          <input data-id={todo.id} defaultValue={todo.text} />
          <button data-id={todo.id} onClick={removeItem}>
            Remover
          </button>
          <SubItem
            subitems={todo.subitems}
            onAddSubitem={() => addSubitem(todo.id)}
            onUpdateSubitem={(subitemId, text) => updateSubitem(todo.id, subitemId, text)}
            onRemoveSubitem={(subitemId) => removeSubitem(todo.id, subitemId)}
          />
        </li>
      ))}
    </ul>
  );
};

export default List;
