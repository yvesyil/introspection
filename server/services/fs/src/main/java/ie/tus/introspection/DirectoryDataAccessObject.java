package ie.tus.introspection;

import java.sql.*;
import java.util.*;

public class DirectoryDataAccessObject {
    private static DirectoryDataAccessObject instance = null;

    private Connection connection;

    private DirectoryDataAccessObject() {
        try {
            connection = DatabaseFactory.getHSQLDBConnection("SA", "");
        } catch (Exception exception) {
            exception.printStackTrace();
        }
    }

    public static DirectoryDataAccessObject getInstance() {
        if (instance == null) {
            instance = new DirectoryDataAccessObject();
        }

        return instance;
    }

    private Directory newDirectoryFromResultSet(ResultSet rs) throws SQLException {
        return new Directory(
                rs.getInt("id"),
                rs.getInt("userId"),
                rs.getString("name"),
                rs.getBoolean("root"),
                rs.getInt("parentId")
        );
    }

    public List<Directory> getAll() {
        List<Directory> directories = new ArrayList<>();
        String query = "SELECT * FROM directory";
        try {
            PreparedStatement ps = connection.prepareStatement(query);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                directories.add(newDirectoryFromResultSet(rs));
            }
        } catch (Exception exception) {
            exception.printStackTrace();
        }
        return directories;
    }

    public List<Directory> getDirectoriesWhere(String key, String type, String value) {
        List<Directory> directories = new ArrayList<>();
        String query = String.format("SELECT * FROM directory WHERE %s = ?", key);
        try {
            PreparedStatement ps = connection.prepareStatement(query);
            switch (type.toLowerCase()) {
                case "int":
                    ps.setInt(1, Integer.parseInt(value));
                    break;
                case "string":
                    ps.setString(1, value);
                    break;
                case "boolean":
                    ps.setBoolean(1, Boolean.parseBoolean(value));
                    break;
            }
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                directories.add(newDirectoryFromResultSet(rs));
            }
        } catch (Exception exception) {
            exception.printStackTrace();
        }
        return directories;
    }

    public List<Directory> getDirectoriesWhere(List<String[]> queryParams) {
        List<Directory> directories = new ArrayList<>();

        StringBuilder query = new StringBuilder();
        query.append("SELECT * FROM directory WHERE");

        for (int i = 0; i < queryParams.size() - 1; i++) {
            query.append(String.format(" %s = ? AND", queryParams.get(i)[0]));
        }
        query.append(String.format(" %s = ?", queryParams.get(queryParams.size() - 1)[0]));

        try {
            PreparedStatement ps = connection.prepareStatement(query.toString());
            int idx = 1;
            for (var entry : queryParams) {
                switch (entry[1].toLowerCase()) {
                    case "int":
                        ps.setInt(idx++, Integer.parseInt(entry[2]));
                        break;
                    case "string":
                        ps.setString(idx++, entry[2]);
                        break;
                    case "boolean":
                        ps.setBoolean(idx++, Boolean.parseBoolean(entry[2]));
                        break;
                }
            }
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                directories.add(newDirectoryFromResultSet(rs));
            }
        } catch (Exception exception) {
            exception.printStackTrace();
        }

        return directories;
    }

    public Directory get(Integer id) {
        Directory dir = null;
        String query = "SELECT * FROM directory WHERE id = ?";
        try {
            PreparedStatement ps = connection.prepareStatement(query);
            ps.setInt(1, id);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                dir = newDirectoryFromResultSet(rs);
            }
        } catch (Exception exception) {
            exception.printStackTrace();
        }
        return dir;
    }

    public boolean add(Directory dir) {
        String query = "INSERT INTO directory (userId, name, root, parentId) VALUES (?, ?, ?, ?)";
        int rows = 0;
        try {
            PreparedStatement ps = connection.prepareStatement(query);
            int idx = 1;
            ps.setInt(idx++, dir.getUserId());
            ps.setString(idx++, dir.getName());
            ps.setBoolean(idx++, dir.isRoot());
            ps.setInt(idx++, dir.getParentId());
            rows =  ps.executeUpdate();
        } catch (Exception exception) {
            exception.printStackTrace();
        }
        return rows > 0;
    }

    public boolean update(Directory dir) {
        if (get(dir.getId()) == null) {
            return false;
        }
        String query = "UPDATE directory SET name = ?, root = ?, parentId = ? WHERE id = ?";
        int rows = 0;
        try {
            PreparedStatement ps = connection.prepareStatement(query);
            int idx = 1;
            ps.setString(idx++, dir.getName());
            ps.setBoolean(idx++, dir.isRoot());
            ps.setInt(idx++, dir.getParentId());
            ps.setInt(idx++, dir.getId());
            rows = ps.executeUpdate();
        } catch (Exception exception) {
            exception.printStackTrace();
        }
        return rows > 0;
    }

    public boolean remove(Integer id) {
        String query = "DELETE FROM directory WHERE id = ?";
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
