import './App.css';
import { Routes, Route } from "react-router-dom";
import { Protected } from './app/features/auth/Protected';
import { AuthForm } from "./app/features/auth/AuthForm";
import { Assets } from "./app/features/main/Assets";
import { Param } from "./app/features/param/Param";

function App() {
	return (
		<Routes>	
			<Route path="/" element={
				<Protected>
					<Assets/>
				</Protected>
			} />
			<Route path="/parameters" element={
				<Protected>
					<Param/>
				</Protected>
			} />
			<Route path="/login" element={<AuthForm/>}/>
		</Routes>
	);
}

export default App;
