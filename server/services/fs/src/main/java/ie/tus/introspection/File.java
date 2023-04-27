package ie.tus.introspection;

public class File {
    private Integer id;
    private int userId;
    private String name;
    private String type;
    private String content;
    private Integer parentId;

    // Bare minimum file
    public File(int userId, String name, int parentId) {
        this.id = null;
        this.userId = userId;
        this.name = name;
        this.type = "text";
        this.content = "";
        this.parentId = parentId;
    }
}
