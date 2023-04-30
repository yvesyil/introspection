package ie.tus.introspection;

import java.io.IOException;
import java.sql.*;
import java.util.*;

public class FileDataAccessObject {
    private static FileDataAccessObject instance = null;
    private Connection connection;

    private FileDataAccessObject() {
        try {
            connection = DatabaseFactory.getHSQLDBConnection("SA", "");
        } catch (Exception exception) {
            exception.printStackTrace();
        }
    }

    public static FileDataAccessObject getInstance() {
        if (instance == null) {
            instance = new FileDataAccessObject();
        }

        return instance;
    }

    private File newFileFromResultSet(ResultSet rs) throws SQLException {
        return new File(
                    rs.getInt("id"),
                    rs.getInt("userId"),
                    rs.getString("name"),
                    rs.getString("type"),
                    rs.getString("content"),
                    rs.getInt("parentId")
                    );
    }

    public List<File> getAll() {
        List<File> files = new ArrayList<>();
        String query = "SELECT * FROM file";
        try {
            PreparedStatement ps = connection.prepareStatement(query);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                files.add(newFileFromResultSet(rs));
            }
        } catch (Exception exception) {
            exception.printStackTrace();
        }
        return files;
    }

    public File get(Integer id) {
        File file = null;
        String query = "SELECT * FROM file WHERE id = ?";
        try {
            PreparedStatement ps = connection.prepareStatement(query);
            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                file = newFileFromResultSet(rs);
            }
        } catch (Exception exception) {
            exception.printStackTrace();
        }
        return file;
    }

    public boolean add(File file) {
        String query = "INSERT INTO file (userId, name, type, content, parentId) VALUES (?, ?, ?, ?, ?)";
        int rows = 0;
        try {
            PreparedStatement ps = connection.prepareStatement(query);
            int idx = 1;
            ps.setInt(idx++, file.getUserId());
            ps.setString(idx++, file.getName());
            ps.setString(idx++, file.getType());
            ps.setString(idx++, file.getContent());
            ps.setInt(idx++, file.getParentId());
            rows =  ps.executeUpdate();
        } catch (Exception exception) {
            exception.printStackTrace();
        }
        return rows > 0;
    }

    public boolean update(File file) {
        if (get(file.getId()) == null) {
            return false;
        }
        String query = "UPDATE file SET name = ?, type = ?, content = ?, parentId = ? WHERE id = ?";
        int rows = 0;
        try {
            PreparedStatement ps = connection.prepareStatement(query);
            int idx = 1;
            ps.setString(idx++, file.getName());
            ps.setString(idx++, file.getType());
            ps.setString(idx++, file.getContent());
            ps.setInt(idx++, file.getParentId());
            ps.setInt(idx++, file.getId());
            rows = ps.executeUpdate();
        } catch (Exception exception) {
            exception.printStackTrace();
        }
        return rows > 0;
    }

    public boolean remove(Integer id) {
        String query = "DELETE FROM file WHERE id = ?";
        int rows = 0;
        try {
            PreparedStatement ps = connection.prepareStatement(query);
            ps.setInt(1, id);
            rows = ps.executeUpdate();
        } catch (Exception exception) {
            exception.printStackTrace();
        }
        return rows > 0;
    }
}
