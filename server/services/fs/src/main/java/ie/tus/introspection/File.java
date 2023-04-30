package ie.tus.introspection;

public class File {
    private Integer id;
    private Integer userId;
    private String name;
    private String type;
    private String content;
    private Integer parentId;

    public File() {
        this.id = null;
        this.userId = null;
        this.name = "";
        this.type = "";
        this.content = "";
        this.parentId = null;
    }

    // Bare minimum file
    public File(int userId, String name, int parentId) {
        this.id = null;
        this.userId = userId;
        this.name = name;
        this.type = "text";
        this.content = "";
        this.parentId = parentId;
    }

    public File(Integer id, Integer userId, String name, String type, String content, Integer parentId) {
        this.id = id;
        this.userId = userId;
        this.name = name;
        this.type = type;
        this.content = content;
        this.parentId = parentId;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Integer getParentId() {
        return parentId;
    }

    public void setParentId(Integer parentId) {
        this.parentId = parentId;
    }
}
