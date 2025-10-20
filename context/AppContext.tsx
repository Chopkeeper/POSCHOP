import * as React from 'react';
import { AppState, Action, User, Order, OrderStatus, Product } from '../types';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS, INITIAL_USERS } from '../constants';

const APP_STATE_KEY = 'smart-pos-app-state';

const initialState: AppState = {
  products: INITIAL_PRODUCTS,
  users: INITIAL_USERS,
  currentUser: null,
  currentOrder: [],
  liveOrders: [],
  settings: INITIAL_SETTINGS,
};

const appReducer = (state: AppState, action: Action): AppState => {
  switch (action.type) {
    case 'LOGIN': {
      const { username, password } = action.payload;
      const user = state.users.find(u => u.username === username && u.password === password);
      return {
        ...state,
        currentUser: user || null,
      };
    }
    case 'LOGOUT':
      return {
        ...state,
        currentUser: null,
      };
    case 'ADD_TO_ORDER': {
      const productToAdd = action.payload;
      const existingItem = state.currentOrder.find(item => item.id === productToAdd.id);

      if (existingItem) {
        if (existingItem.quantity < productToAdd.stock) {
          return {
            ...state,
            currentOrder: state.currentOrder.map(item =>
              item.id === productToAdd.id ? { ...item, quantity: item.quantity + 1 } : item
            ),
          };
        }
        return state; // Do nothing if stock is reached
      } else {
        if (productToAdd.stock > 0) {
          return {
            ...state,
            currentOrder: [...state.currentOrder, { ...productToAdd, quantity: 1 }],
          };
        }
        return state; // Do nothing if out of stock
      }
    }
    case 'REMOVE_FROM_ORDER': {
        return {
            ...state,
            currentOrder: state.currentOrder.filter(item => item.id !== action.payload)
        };
    }
    case 'UPDATE_QUANTITY': {
        const { productId, quantity } = action.payload;
        if (quantity <= 0) {
            return {
                ...state,
                currentOrder: state.currentOrder.filter(item => item.id !== productId)
            };
        }
        const productInState = state.products.find(p => p.id === productId);
        if (!productInState) return state;

        return {
            ...state,
            currentOrder: state.currentOrder.map(item =>
                item.id === productId
                ? { ...item, quantity: Math.min(quantity, productInState.stock) }
                : item
            ),
        };
    }
    case 'CLEAR_ORDER': {
        return {
            ...state,
            currentOrder: [],
        };
    }
    case 'CREATE_ORDER': {
        const newOrder: Order = {
            ...action.payload,
            createdAt: new Date().toISOString(),
        };
        const updatedProducts = state.products.map(p => {
            const orderedItem = newOrder.items.find(item => item.id === p.id);
            if (orderedItem) {
                return { ...p, stock: p.stock - orderedItem.quantity };
            }
            return p;
        });

        return {
            ...state,
            liveOrders: [...state.liveOrders, newOrder],
            products: updatedProducts,
        };
    }
    case 'UPDATE_ORDER_STATUS': {
        return {
            ...state,
            liveOrders: state.liveOrders.map(order =>
                order.id === action.payload.orderId ? { ...order, status: action.payload.status } : order
            )
        };
    }
    case 'ADD_PRODUCT': {
        return {
            ...state,
            products: [...state.products, action.payload]
        };
    }
    case 'UPDATE_PRODUCT': {
        return {
            ...state,
            products: state.products.map(p => p.id === action.payload.id ? action.payload : p)
        };
    }
    case 'DELETE_PRODUCT': {
        return {
            ...state,
            products: state.products.filter(p => p.id !== action.payload)
        };
    }
    case 'UPDATE_SETTINGS': {
        return {
            ...state,
            settings: action.payload,
        };
    }
    case 'ADD_USER': {
        const newUser: User = {
            ...action.payload,
            id: `user-${Date.now()}`,
        };
        return {
            ...state,
            users: [...state.users, newUser],
        };
    }
    case 'DELETE_USER': {
        return {
            ...state,
            users: state.users.filter(u => u.id !== action.payload)
        };
    }
    default:
      return state;
  }
};

interface AppContextType {
    state: AppState;
    dispatch: React.Dispatch<Action>;
}

const AppContext = React.createContext<AppContextType>({
    state: initialState,
    dispatch: () => null,
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const initializer = (initialValue = initialState) => {
        try {
            const storedState = window.localStorage.getItem(APP_STATE_KEY);
            if (storedState) {
                const parsedState = JSON.parse(storedState);
                // To ensure app updates with new settings from code, overwrite stored settings.
                return { ...parsedState, settings: INITIAL_SETTINGS };
            }
            return initialValue;
        } catch (error) {
            console.error("Error reading from local storage", error);
            return initialValue;
        }
    };

    const [state, dispatch] = React.useReducer(appReducer, initialState, initializer);

    React.useEffect(() => {
        try {
            window.localStorage.setItem(APP_STATE_KEY, JSON.stringify(state));
        } catch (error) {
            console.error("Error writing to local storage", error);
        }
    }, [state]);

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = React.useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};