import { Navigate } from "react-router-dom";
import type { JSX } from "react/jsx-dev-runtime";

interface ProtectedRouteProps {
    children: JSX.Element;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const token = localStorage.getItem("token");
    console.log("ok Token:", token);
    if (!token) {
        return <Navigate to="/signin" replace />;
    }

    return children;
}
