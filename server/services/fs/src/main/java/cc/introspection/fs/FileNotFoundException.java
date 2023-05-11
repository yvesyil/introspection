package cc.introspection.fs;

public class FileNotFoundException extends RuntimeException {
    public FileNotFoundException(Long id) {
        super("Could not find file " + id);
    }
}
