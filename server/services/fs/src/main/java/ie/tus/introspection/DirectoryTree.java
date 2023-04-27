package ie.tus.introspection;

import java.util.List;

public class DirectoryTree {
    private List<Directory> directories;
    private List<File> files;

    DirectoryTree() {
        this.directories = null;
        this.files = null;
    }

    public List<Directory> getDirectories() {
        return directories;
    }

    public void setDirectories(List<Directory> directories) {
        this.directories = directories;
    }

    public List<File> getFiles() {
        return files;
    }

    public void setFiles(List<File> files) {
        this.files = files;
    }
}
