﻿// <auto-generated />
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using StoryMapApi.Data;

#nullable disable

namespace StoryMapApi.Migrations
{
    [DbContext(typeof(ApplicationDbContext))]
    partial class ApplicationDbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "9.0.5");

            modelBuilder.Entity("StoryMapApi.Models.Activity", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Date")
                        .HasColumnType("TEXT");

                    b.Property<string>("Description")
                        .HasColumnType("TEXT");

                    b.Property<int>("ProjectId")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("ProjectId1")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Title")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("ProjectId");

                    b.HasIndex("ProjectId1");

                    b.ToTable("Activities");
                });

            modelBuilder.Entity("StoryMapApi.Models.Artwork", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("ActivityTitle")
                        .HasColumnType("TEXT");

                    b.Property<string>("Description")
                        .HasColumnType("TEXT");

                    b.Property<string>("ImageUrl")
                        .HasColumnType("TEXT");

                    b.Property<int>("ProjectId")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("ProjectId1")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Title")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("ProjectId");

                    b.HasIndex("ProjectId1");

                    b.ToTable("Artworks");
                });

            modelBuilder.Entity("StoryMapApi.Models.Outcome", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Link")
                        .HasColumnType("TEXT");

                    b.Property<int>("ProjectId")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("ProjectId1")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Summary")
                        .HasColumnType("TEXT");

                    b.Property<string>("Title")
                        .HasColumnType("TEXT");

                    b.Property<string>("Type")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("ProjectId")
                        .IsUnique();

                    b.HasIndex("ProjectId1");

                    b.ToTable("Outcomes");
                });

            modelBuilder.Entity("StoryMapApi.Models.Poem", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Author")
                        .HasColumnType("TEXT");

                    b.Property<string>("Content")
                        .HasColumnType("TEXT");

                    b.Property<int>("ProjectId")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("ProjectId1")
                        .HasColumnType("INTEGER");

                    b.Property<string>("Title")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("ProjectId");

                    b.HasIndex("ProjectId1");

                    b.ToTable("Poems");
                });

            modelBuilder.Entity("StoryMapApi.Models.Project", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Affiliation")
                        .HasColumnType("TEXT");

                    b.Property<string>("College")
                        .HasColumnType("TEXT");

                    b.Property<string>("DescriptionLong")
                        .HasColumnType("TEXT");

                    b.Property<string>("DescriptionShort")
                        .HasColumnType("TEXT");

                    b.Property<bool>("HasArtwork")
                        .HasColumnType("INTEGER");

                    b.Property<bool>("HasOutcomes")
                        .HasColumnType("INTEGER");

                    b.Property<bool>("HasPoems")
                        .HasColumnType("INTEGER");

                    b.Property<string>("ImageUrl")
                        .HasColumnType("TEXT");

                    b.Property<string>("Latitude")
                        .HasColumnType("TEXT");

                    b.Property<string>("Location")
                        .HasColumnType("TEXT");

                    b.Property<string>("Longitude")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .HasColumnType("TEXT");

                    b.Property<string>("ProjectCategory")
                        .HasColumnType("TEXT");

                    b.Property<string>("ProjectName")
                        .HasColumnType("TEXT")
                        .HasAnnotation("Relational:JsonPropertyName", "Project");

                    b.Property<string>("Title")
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("Projects");
                });

            modelBuilder.Entity("StoryMapApi.Models.Activity", b =>
                {
                    b.HasOne("StoryMapApi.Models.Project", null)
                        .WithMany("Activities")
                        .HasForeignKey("ProjectId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("StoryMapApi.Models.Project", "Project")
                        .WithMany()
                        .HasForeignKey("ProjectId1");

                    b.Navigation("Project");
                });

            modelBuilder.Entity("StoryMapApi.Models.Artwork", b =>
                {
                    b.HasOne("StoryMapApi.Models.Project", null)
                        .WithMany("Artworks")
                        .HasForeignKey("ProjectId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("StoryMapApi.Models.Project", "Project")
                        .WithMany()
                        .HasForeignKey("ProjectId1");

                    b.Navigation("Project");
                });

            modelBuilder.Entity("StoryMapApi.Models.Outcome", b =>
                {
                    b.HasOne("StoryMapApi.Models.Project", null)
                        .WithOne("Outcome")
                        .HasForeignKey("StoryMapApi.Models.Outcome", "ProjectId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("StoryMapApi.Models.Project", "Project")
                        .WithMany()
                        .HasForeignKey("ProjectId1");

                    b.Navigation("Project");
                });

            modelBuilder.Entity("StoryMapApi.Models.Poem", b =>
                {
                    b.HasOne("StoryMapApi.Models.Project", null)
                        .WithMany("Poems")
                        .HasForeignKey("ProjectId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("StoryMapApi.Models.Project", "Project")
                        .WithMany()
                        .HasForeignKey("ProjectId1");

                    b.Navigation("Project");
                });

            modelBuilder.Entity("StoryMapApi.Models.Project", b =>
                {
                    b.Navigation("Activities");

                    b.Navigation("Artworks");

                    b.Navigation("Outcome");

                    b.Navigation("Poems");
                });
#pragma warning restore 612, 618
        }
    }
}
