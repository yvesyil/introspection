package cc.introspection.fs.exception;

public class DirectoryNotFoundException extends RuntimeException {
    public DirectoryNotFoundException(Long id) {
        super("Could not find directory " + id);
    }
}
