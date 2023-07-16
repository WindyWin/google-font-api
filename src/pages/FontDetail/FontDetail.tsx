import { useParams } from "react-router-dom";

function FontDetail() {
    const { id } = useParams();

    console.log(id)
    return (
        <div>FontDetail for id</div>
    )
}

export default FontDetail