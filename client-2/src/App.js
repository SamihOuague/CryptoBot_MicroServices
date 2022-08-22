import './App.css';
import { Routes, Route } from "react-router-dom";
import { Protected } from './app/features/auth/Protected';
import { AuthForm } from "./app/features/auth/AuthForm";
import { Main } from "./app/features/main/Main";
import { Param } from "./app/features/param/Param";
import { Asset } from "./app/features/asset/Asset";

function App() {
	return (
		<Routes>	
			<Route path="/" element={
				<Protected>
					<Main/>
				</Protected>
			} />
			<Route path="/asset/:symbol" element={
				<Protected>
					<Asset/>
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
