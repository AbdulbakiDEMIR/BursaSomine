import ProjectForm from '../components/ProjectForm';

export default function NewProjectPage() {
    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8">
            <ProjectForm mode="create" />
        </div>
    );
}
